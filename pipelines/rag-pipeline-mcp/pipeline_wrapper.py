from pathlib import Path
from haystack import Pipeline
from hayhooks import BasePipelineWrapper
from haystack.dataclasses import ChatMessage

class PipelineWrapper(BasePipelineWrapper):
    def setup(self) -> None:
        pipeline_yaml = (Path(__file__).parent / "rag-pipeline-mcp.yaml").read_text()
        self.pipeline = Pipeline.loads(pipeline_yaml)

    def run_api(self, input_text: str) -> str:
        input_with_prompt = "I am going to ask you something about the mcp-demo-api repository. Please use the provided tools to find your answer. If you do not have this repository in your context, say 'I don't have the repo in my context.' The question is: ' " + input_text
        user_input_msg = ChatMessage.from_user(text=input_with_prompt)
        result = self.pipeline.run({"llm": { "messages": [user_input_msg] }, "adapter": {"initial_msg": [user_input_msg]}})
        return result["response_llm"]["replies"][0].text