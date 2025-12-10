from langchain_core.callbacks.base import BaseCallbackHandler

class AgentDebugHandler(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print("\n===== LLM START =====")
        print("serialized:", serialized)
        print("prompts:")
        for p in prompts:
            print(p)
        print("=====================\n")

    def on_llm_end(self, response, **kwargs):
        print("\n===== LLM END =====")
        # response.generations: [[Generation, ...], ...]
        for i, gen_list in enumerate(response.generations):
            print(f"[LLM output {i}] {gen_list[0].text}")
        print("=====================\n")

    def on_tool_start(self, serialized, input_str, **kwargs):
        print("\n===== TOOL START =====")
        print("tool:", serialized.get("name"))
        print("input:", input_str)
        print("======================\n")

    def on_tool_end(self, output, **kwargs):
        print("\n===== TOOL END =====")
        print("output:", output)
        print("====================\n")

    def on_chain_start(self, serialized, inputs, **kwargs):
        print("\n===== CHAIN/GRAPH START =====")
        print("serialized:", serialized)
        print("inputs:", inputs)
        print("=============================\n")

    def on_chain_end(self, outputs, **kwargs):
        print("\n===== CHAIN/GRAPH END =====")
        print("outputs:", outputs)
        print("===========================\n")
