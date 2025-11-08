# MySpace\MyS_Back\dev-serve.py

import subprocess
import time
import sys
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class RestartOnChangeHandler(FileSystemEventHandler):
    def __init__(self, command):
        self.command = command
        self.process = subprocess.Popen(self.command)

    def on_any_event(self, event):
        print(f"[Reloading] Detected change in: {event.src_path}")
        self.process.kill()
        time.sleep(0.5)
        self.process = subprocess.Popen(self.command)

if __name__ == "__main__":
    python_path = sys.executable  # Esto toma el python que está ejecutando este script (dev-serve.py)
    command = [python_path, "serve.py"] 
    event_handler = RestartOnChangeHandler(command)
    observer = Observer()
    observer.schedule(event_handler, path=".", recursive=True)
    observer.start()
    print("Watching for changes. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
