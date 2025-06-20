import json
import os
import requests

from haystack import Pipeline
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator
from haystack.components.preprocessors import DocumentSplitter
from haystack.components.retrievers import InMemoryBM25Retriever
from haystack.components.writers import DocumentWriter
from haystack.dataclasses import Document
from haystack.document_stores.\
    in_memory import InMemoryDocumentStore

url = "https://poetrydb.org/author/"
author_name = "William Shakespeare"

response = requests.get(url+author_name)
data = response.json()
with open("data.json", "w") as outfile:
    json.dump(data, outfile)
    
with open("data.json") as f:
    data = json.load(f)

document_store = InMemoryDocumentStore()
documents = [
    Document(
        content=doc["title"] + " " + " ".join(doc["lines"]),
        meta={"title": doc["title"]}
    )
    for doc in data
]

indexing = Pipeline()
indexing.add_component("splitter", DocumentSplitter())
indexing.add_component("writer", DocumentWriter(document_store))

indexing.connect("splitter", "writer")
indexing.run({"splitter":{"documents": documents}})

retriever = InMemoryBM25Retriever(document_store=document_store)

template = """
Given the following information, answer the question.

Context:
{% for document in documents %}
    {{ document.content }}
{% endfor %}

Question: {{question}}
Answer:
"""

prompt_builder = PromptBuilder(
    template=template, required_variables="*"
)

generator = OpenAIGenerator()

#initializing pipeline
rag_pipeline = Pipeline()
# Add components to your pipeline
rag_pipeline.add_component("retriever", retriever)
rag_pipeline.add_component("prompt_builder", prompt_builder)
rag_pipeline.add_component("llm", generator)
# Now, connect the components to each other
rag_pipeline.connect("retriever", "prompt_builder.documents")
rag_pipeline.connect("prompt_builder", "llm")

rag_pipeline.draw("pipeline_visualization.png")

question = "What is Sonnet 12"
results = rag_pipeline.run(
    {
        "retriever": {"query": question},
        "prompt_builder": {"question": question}
    }, include_outputs_from = ["retriever"]
)

print(results["llm"]['replies'][0])

with open("./tests/first.yaml", "w") as f:
    rag_pipeline.dump(f)