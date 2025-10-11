from app.models import Base, engine

# Utwórz wszystkie tabele
Base.metadata.create_all(bind=engine)
print("Nowa baza danych utworzona!")
