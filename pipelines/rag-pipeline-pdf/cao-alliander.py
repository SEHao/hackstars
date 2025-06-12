import json
import os
import requests

from haystack import Pipeline
from haystack.components.builders import (
    AnswerBuilder, ChatPromptBuilder
)
from haystack.components.converters import PyPDFToDocument
from haystack.components.embedders import (
    SentenceTransformersTextEmbedder,
    SentenceTransformersDocumentEmbedder
)
from haystack.components.generators.\
    chat import OpenAIChatGenerator
from haystack.components.preprocessors import (
    DocumentCleaner, DocumentSplitter
)
from haystack.components.\
    retrievers import InMemoryEmbeddingRetriever
from haystack.components.writers import DocumentWriter
from haystack.dataclasses import ChatMessage
from haystack.document_stores.\
    in_memory import InMemoryDocumentStore

document_store = InMemoryDocumentStore()
document_writer = DocumentWriter(document_store)
    
splitter = DocumentSplitter("sentence", 5)
document_embedder = SentenceTransformersDocumentEmbedder()

pipeline = Pipeline()
pipeline.add_component("converter", PyPDFToDocument())
pipeline.add_component("cleaner", DocumentCleaner())
pipeline.add_component("splitter", splitter)
pipeline.add_component("document_embedder", document_embedder)
pipeline.add_component("document_writer", document_writer)

pipeline.connect("converter", "cleaner")
pipeline.connect("cleaner", "splitter")
pipeline.connect("splitter", "document_embedder")
pipeline.connect("document_embedder", "document_writer")

pipeline.run({
    "converter": {
        "sources": ["Bedrijfscao_Alliander.pdf"]
    }
})

template = [ChatMessage.from_user("""
Answer the questions based on the given context.
If the context is not relevant, say "I don't know."
                                  
Context:
{% for document in documents %}
    {{ document.content }}
{% endfor %}
                                  
Question: {{question}}
Answer:
"""
)]

text_embedder = SentenceTransformersTextEmbedder()
retriever = InMemoryEmbeddingRetriever(document_store)
prompt_builder = ChatPromptBuilder(template=template)
chat_generator = OpenAIChatGenerator()
answer_builder = AnswerBuilder()

basic_rag = Pipeline()

basic_rag.add_component("text_embedder", text_embedder)
basic_rag.add_component("retriever", retriever)
basic_rag.add_component("prompt_builder", prompt_builder)
basic_rag.add_component("llm", chat_generator)
basic_rag.add_component("answer_builder", answer_builder)


basic_rag.connect("text_embedder.embedding",
    "retriever.query_embedding")
basic_rag.connect("retriever", "prompt_builder.documents")
basic_rag.connect("prompt_builder.prompt", "llm.messages")
basic_rag.connect("llm.replies", "answer_builder.replies")
basic_rag.connect("retriever", "answer_builder.documents")

q = "What are the fixed salary growth rates from 1 January 2025?"
response = basic_rag.run(
    data = {
        "text_embedder": {"text": q},
        "prompt_builder": {"question": q},
        "answer_builder": {"query": q}
    }
)

# Extract the answer text
answer_obj = response["answer_builder"]["answers"][0]  # It's a list with one GeneratedAnswer
print("\n🔍 Answer:", answer_obj.data)
 
# Optional: Print supporting metadata or documents
print("\n📄 Based on document:", answer_obj.documents[0].meta["file_path"])
print("📄 Page:", answer_obj.documents[0].meta["page_number"])

with open("./tests/pdf.yaml", "w") as f:
    basic_rag.dump(f)   