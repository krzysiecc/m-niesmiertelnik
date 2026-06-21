"""Notification helpers for the emergency-card (ICE) feature.

This module is a stub for a planned feature: when a patient's emergency
card is scanned by a paramedic, their trusted contacts (in-case-of-emergency
contacts) will be notified that the card has been accessed. The transport
mechanism (SMS, push, email) is not yet decided, so the implementation is
left unfinished on purpose.
"""


def notify_trusted_contacts(contacts: list, patient_name: str) -> None:
    """Notify a patient's trusted contacts that their card was scanned.

    Not yet implemented. Intended to deliver a message to each contact in
    ``contacts`` informing them that ``patient_name``'s emergency card was
    accessed.
    """
    raise NotImplementedError(
        "Trusted-contact notifications are not implemented yet."
    )
