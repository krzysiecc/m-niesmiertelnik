#!/usr/bin/env python3
"""
Skrypt do sprawdzenia struktury bazy danych SQLite
"""
import sqlite3
import sys

def analyze_database(db_path):
    """Analizuje strukturę bazy danych SQLite"""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print(f"📊 STRUKTURA BAZY DANYCH: {db_path}")
        print("=" * 80)
        
        # Pobierz listę wszystkich tabel
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        if not tables:
            print("❌ Brak tabel w bazie danych")
            return
            
        print(f"📋 TABELE ({len(tables)}):")
        for (table_name,) in tables:
            print(f"  • {table_name}")
        
        print("\n" + "=" * 80)
        
        # Dla każdej tabeli pokaż strukturę
        for (table_name,) in tables:
            print(f"\n🏗️  TABELA: {table_name}")
            print("-" * 50)
            
            # Pobierz informacje o kolumnach
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            
            print("KOLUMNY:")
            for col in columns:
                cid, name, data_type, not_null, default_value, pk = col
                pk_text = " [PRIMARY KEY]" if pk else ""
                not_null_text = " NOT NULL" if not_null else ""
                default_text = f" DEFAULT: {default_value}" if default_value else ""
                
                print(f"  {cid+1:2d}. {name:20s} {data_type:15s}{pk_text}{not_null_text}{default_text}")
            
            # Pobierz indeksy
            cursor.execute(f"PRAGMA index_list({table_name});")
            indexes = cursor.fetchall()
            
            if indexes:
                print("\nINDEKSY:")
                for idx in indexes:
                    seq, name, unique, origin, partial = idx
                    unique_text = " [UNIQUE]" if unique else ""
                    print(f"  • {name}{unique_text}")
            
            # Pobierz kilka przykładowych rekordów
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            count = cursor.fetchone()[0]
            
            print(f"\nILOŚĆ REKORDÓW: {count}")
            
            if count > 0:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 3;")
                records = cursor.fetchall()
                column_names = [description[0] for description in cursor.description]
                
                print("\nPRZYKŁADOWE DANE:")
                for i, record in enumerate(records, 1):
                    print(f"  Rekord {i}:")
                    for col_name, value in zip(column_names, record):
                        # Skróć długie wartości
                        if isinstance(value, str) and len(value) > 50:
                            value = value[:47] + "..."
                        print(f"    {col_name}: {value}")
                    print()
        
        conn.close()
        print("=" * 80)
        print("✅ Analiza zakończona pomyślnie!")
        
    except sqlite3.Error as e:
        print(f"❌ Błąd SQLite: {e}")
    except Exception as e:
        print(f"❌ Błąd: {e}")

if __name__ == "__main__":
    db_path = "test.db"  # Domyślna ścieżka
    if len(sys.argv) > 1:
        db_path = sys.argv[1]
    
    analyze_database(db_path)