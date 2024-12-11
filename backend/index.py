import os
import threading
import json
from time import time

import webview


class Api:
    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()

    def save_content(self, content):
        filename = webview.windows[0].create_file_dialog(webview.SAVE_DIALOG)
        if not filename:
            return

        with open(filename, "w") as f:
            f.write(content)

    def save_settings(self, settings):
        s = json.dumps(settings, indent=4)
        with open("./settings.json", "w") as f:
            f.write(s)

    def get_settings(self, settings):
        if os.path.exists("./settings.json"):
            with open(json.dumps("./settings.json"), "r") as f:
                settings = f.read()
            return json.loads(settings)
        return {"godotExecute": ""}

    def get_godot_execute(self):
        filename = webview.active_window().create_file_dialog(
            dialog_type=webview.OPEN_DIALOG,
            allow_multiple=False,
            directory="~",
            file_types=("Godot Execute (*.exe)",),
        )
        if not filename:
            return
        return filename

    def ls(self):
        return os.listdir(".")


def get_entrypoint():
    def exists(path):
        return os.path.exists(os.path.join(os.path.dirname(__file__), path))

    if exists("../gui/index.html"):  # unfrozen development
        return "../gui/index.html"

    if exists("../Resources/gui/index.html"):  # frozen py2app
        return "../Resources/gui/index.html"

    if exists("./gui/index.html"):
        return "./gui/index.html"

    raise Exception("No index.html found")


def set_interval(interval):
    def decorator(function):
        def wrapper(*args, **kwargs):
            stopped = threading.Event()

            def loop():  # executed in another thread
                while not stopped.wait(interval):  # until stopped
                    function(*args, **kwargs)

            t = threading.Thread(target=loop)
            t.daemon = True  # stop if the program exits
            t.start()
            return stopped

        return wrapper

    return decorator


entry = get_entrypoint()


@set_interval(1)
def update_ticker():
    if len(webview.windows) > 0:
        webview.windows[0].evaluate_js(
            'window.pywebview.state.setTicker("%d")' % time()
        )


if __name__ == "__main__":
    window = webview.create_window(
        "pywebview-react boilerplate",
        entry,
        js_api=Api(),
        width=1024,
        height=800,
        min_size=(1024, 800),
    )
    window.settings = {
        "ALLOW_FILE_URLS": True,
        "OPEN_EXTERNAL_LINKS_IN_BROWSER": True,
        "OPEN_DEVTOOLS_IN_DEBUG": True,
    }
    webview.start(update_ticker, debug=True)
