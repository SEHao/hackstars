from pathlib import Path
from haystack import Pipeline
from hayhooks import BasePipelineWrapper

class PipelineWrapper(BasePipelineWrapper):
    def setup(self) -> None:
        pipeline_yaml = (Path(__file__).parent / "rag-pipeline-mcp.yaml").read_text()
        self.pipeline = Pipeline.loads(pipeline_yaml)

    def run_api(self, input_text: str) -> str:
        result = self.pipeline.run({"llm": { "messages": [input_text] }, "adapter": {"initial_msg": [input_text]}})
        return result["response_llm"]["replies"][0].text