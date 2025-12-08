# tests/test_translator.py
import pytest
from app.translator import translate_prompt, _translate_heuristic

def test_translate_heuristic():
    result = _translate_heuristic("portrait photo")
    assert result["prompt_text"] == "portrait photo"
    assert result["camera"] == 50
    assert result["fov"] == 35
    assert "lighting" in result
    assert "palette" in result

def test_translate_product():
    result = _translate_heuristic("product shot")
    assert result["camera"] == 35
    assert result["fov"] == 45

def test_translate_generic():
    result = _translate_heuristic("landscape scene")
    assert result["camera"] == 45
    assert result["fov"] == 40

def test_translate_prompt():
    result = translate_prompt("test prompt")
    assert "prompt_text" in result
    assert "camera" in result
    assert "fov" in result
    assert isinstance(result["camera"], (int, float))
    assert isinstance(result["fov"], (int, float))
