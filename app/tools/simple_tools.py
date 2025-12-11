import logging
from langchain.tools import tool


logger = logging.getLogger(__name__)

@tool
def count_letters_from_word(word: str, letter: str) -> str:
    """Counts the number of times a letter appears in a word."""
    logger.info(f"[+] {count_letters_from_word.name} tool called")
    return str(word.count(letter))


@tool
def multiply(a: int, b: int) -> str:
    """Multiplies two integers together."""
    logger.info(f"[+] {multiply.name} tool called")
    return str(a * b)


simple_tools = [count_letters_from_word, multiply]