import logging
import sys


def setup_logging():
    """
    Configures the application's logging settings.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        stream=sys.stdout,  # Explicitly set stream to stdout
    )
    # You can add more complex handlers here, e.g., for logging to a file
    # handler = logging.FileHandler("app.log")
    # formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    # handler.setFormatter(formatter)
    # logging.getLogger().addHandler(handler)

