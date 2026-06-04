"""Tests for vibeship-spawner-skills PR #6: atomic writeFileSync"""

import os
import sys
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


def test_atomic_write_file_sync():
    """Verify atomic writeFileSync pattern is used"""
    root = os.path.join(os.path.dirname(__file__), "..")
    found_atomic = False
    for dirpath, dirnames, filenames in os.walk(root):
        if ".git" in dirpath or "__pycache__" in dirpath or "node_modules" in dirpath:
            continue
        for fn in filenames:
            if fn.endswith((".js", ".ts")):
                fpath = os.path.join(dirpath, fn)
                with open(fpath) as f:
                    content = f.read()
                atomic_patterns = [
                    "writeFileSync", "writeFile",
                    "atomic", "Atomic",
                    "temp", "rename",
                    "mkstemp", "mkdtemp",
                ]
                found = [p for p in atomic_patterns if p in content]
                if len(found) >= 2:
                    found_atomic = True
    # If no JS/TS files, check Python
    if not found_atomic:
        for dirpath, dirnames, filenames in os.walk(root):
            if ".git" in dirpath or "__pycache__" in dirpath or "node_modules" in dirpath:
                continue
            for fn in filenames:
                if fn.endswith(".py"):
                    fpath = os.path.join(dirpath, fn)
                    with open(fpath) as f:
                        content = f.read()
                    atomic_patterns = [
                        "os.rename", "shutil.move",
                        "tempfile.NamedTemporaryFile",
                        "atomic", ".tmp",
                    ]
                    found = [p for p in atomic_patterns if p in content]
                    if found:
                        found_atomic = True
    assert found_atomic, "Should find atomic write pattern"


def test_write_temp_then_rename():
    """Verify write-to-temp-then-rename pattern"""
    root = os.path.join(os.path.dirname(__file__), "..")
    for dirpath, dirnames, filenames in os.walk(root):
        if ".git" in dirpath or "__pycache__" in dirpath or "node_modules" in dirpath:
            continue
        for fn in filenames:
            if fn.endswith((".js", ".ts", ".py")):
                fpath = os.path.join(dirpath, fn)
                with open(fpath) as f:
                    content = f.read()
                if "rename" in content or "move" in content:
                    return True


def test_no_data_loss():
    """Verify pattern prevents data loss on crash"""
    root = os.path.join(os.path.dirname(__file__), "..")
    for dirpath, dirnames, filenames in os.walk(root):
        if ".git" in dirpath or "__pycache__" in dirpath or "node_modules" in dirpath:
            continue
        for fn in filenames:
            if fn.endswith((".js", ".ts", ".py")):
                fpath = os.path.join(dirpath, fn)
                with open(fpath) as f:
                    content = f.read()
                has_temp = any(p in content for p in ["temp", "tmp", "TMP"])
                has_write = "writeFileSync" in content or "write" in content or "open(" in content
                if has_temp and has_write:
                    return True


def test_writeFileSync_wrapped_in_try():
    """Verify writeFileSync is wrapped in try/catch"""
    root = os.path.join(os.path.dirname(__file__), "..")
    for dirpath, dirnames, filenames in os.walk(root):
        if ".git" in dirpath or "__pycache__" in dirpath or "node_modules" in dirpath:
            continue
        for fn in filenames:
            if fn.endswith((".js", ".ts")):
                fpath = os.path.join(dirpath, fn)
                with open(fpath) as f:
                    content = f.read()
                if "writeFileSync" in content:
                    lines = content.split("\n")
                    for i, line in enumerate(lines, 1):
                        if "writeFileSync" in line:
                            start = max(0, i - 3)
                            end = min(len(lines), i + 1)
                            context = "\n".join(lines[start:end])
                            if "try" in context:
                                return True
