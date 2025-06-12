from pathlib import Path
from haystack import Pipeline
from hayhooks import BasePipelineWrapper

class PipelineWrapper(BasePipelineWrapper):
    def setup(self) -> None:
        pipeline_yaml = (Path(__file__).parent / "basic.yaml").read_text()
        self.pipeline = Pipeline.loads(pipeline_yaml)

    def run_api(self, input_text: str) -> str:
        result = self.pipeline.run({"retriever": {"query": input_text}, "prompt_builder": {"question": input_text}, "llm": {}})
        return result["llm"]["replies"][0]