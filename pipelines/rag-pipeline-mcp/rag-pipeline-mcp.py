import json
import os
import requests
from haystack import Pipeline
from haystack.components.converters import OutputAdapter
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.components.tools import ToolInvoker
from haystack.dataclasses import ChatMessage

from haystack.tools import Tool, Toolset
from haystack_integrations.tools.mcp import MCPTool, SSEServerInfo, MCPToolset

mcp_server_info = SSEServerInfo(base_url="https://gitmcp.io/SEHao/hackstars")
search_docs = MCPTool(name="search_hackstars_documentation", server_info=mcp_server_info)
code_tool = MCPTool(name="search_hackstars_code", server_info=mcp_server_info)
toolset = MCPToolset(server_info=mcp_server_info, tool_names=["search_hackstars_documentation", "search_hackstars_code"])

pipeline = Pipeline()
pipeline.add_component("llm", OpenAIChatGenerator(model="gpt-4o-mini", tools=toolset))
pipeline.add_component("tool_invoker", ToolInvoker(tools=toolset))
pipeline.add_component(
    "adapter",
    OutputAdapter(
        template="{{ initial_msg + initial_tool_messages + tool_messages }}",
        output_type=list[ChatMessage],
        unsafe=True,
    ),
)
pipeline.add_component("response_llm", OpenAIChatGenerator(model="gpt-4o-mini"))
pipeline.connect("llm.replies", "tool_invoker.messages")
pipeline.connect("llm.replies", "adapter.initial_tool_messages")
pipeline.connect("tool_invoker.tool_messages", "adapter.tool_messages")
pipeline.connect("adapter.output", "response_llm.messages")

user_input = "What services exist inside the HttpCat module inside the mcp-demo-api app, and what is their purpose?"  # WIP: user input
user_input_msg = ChatMessage.from_user(text=user_input)

result = pipeline.run({"llm": {"messages": [user_input_msg]}, "adapter": {"initial_msg": [user_input_msg]}})

print(result["response_llm"]["replies"][0].text)

with open("./rag-pipeline-mcp.yaml", "w") as f:
    pipeline.dump(f)
