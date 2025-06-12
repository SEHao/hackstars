from pathlib import Path
from haystack import Pipeline
from hayhooks import BasePipelineWrapper

class PipelineWrapper(BasePipelineWrapper):
    def setup(self) -> None:
        pipeline_yaml = (Path(__file__).parent / "cao-alliander.yaml").read_text()
        self.pipeline = Pipeline.loads(pipeline_yaml)

    def run_api(self, input_text: str) -> str:
        result = self.pipeline.run({"prompt_builder": {"question": input_text}, "answer_builder": {"query": input_text}, "llm": {}, "retriever": {"query": input_text}, "text_embedder": {"text": input_text}})
        return result["answer_builder"]["answers"][0]["data"]