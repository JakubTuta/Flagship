## Wprowadzenie

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2F5BJYLX6YJUQF4wXikNINDSCDZNvpQk?alt=media&token=10ea4ae8-c106-4366-af89-08e612db4f89)

Notacja *O(n)* w strukturach danych opisuje najgorszy przypadek złożoności algorytmu, analizując w jaki sposób jego wydajność (czas wykonania lub wykorzystanie pamięci) skaluje się wraz z rozmiarem danych wejściowych, oznaczonym przez "n".

## Tablica

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2FQw8mDu3l0DXPxIrBn89QDSXhqiBxf?alt=media&token=c1918402-1087-4112-bc12-13381165933d)

**Opis**
Tablice to kolekcje elementów przechowywanych w ciągłej pamięci komputera, do wybranego elementu można dostać się za pomocą numerycznego indeksu. Każdy element zajmuje taką samą ilość pamięci pozwalając na prosty dostęp do danych pod wybranym indeksem *(początek pamięci + (indeks * ilość pamięci pojedynczego elementu))*.

**Zalety**
- Stały czas dostępu do danych niezależnie od wielkości tablicy
- Bardzo szybkie pobieranie całej tablicy do pamięci podręcznej procesora
- Zajmuje mało miejsca w pamięci w porównaniu z innymi strukturami danych
- Proste i intuicyjne indeksowanie danych

**Wady**
- Statyczna struktura danych wymaga alokowania nowych bloków pamięci w przypadku dodawania większej ilości danych, a następnie ich kopiowania
- Wymagające operacje dodawania lub usuwania danych
- Alokacja pamięci musi być ciągła

**Operacje**
- **Dodawanie:** dodawanie na koniec *O(1)*, wstawianie w środek *O(n)*
- **Usuwanie:** usuwanie z wybranej pozycji *O(n)*
- **Przeszukiwanie:** dostęp przez indeks *O(1)*, szukanie wartości *O(n)*

## Lista powiązana

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2FgSe0VP7oH9UlkiiHqfCWcMPd5TuLmY?alt=media&token=9bba88ea-f08f-4762-b3c3-d02f490ee9f9)

**Opis**
Lista powiązana składa się z węzłów zawierających dane oraz wskaźnik do następnego elementu (czasami też do poprzedniego - **podwójnie powiązana lista**). Elementy przechowywane są w różnych, rozproszonych miejscach pamięci, powiązane są jedynie poprzez referencje w pamięci tworząc sekwencyjny łańcuch danych bez potrzeby rezerwowania dużego bloku pamięci.

**Zalety**
- Dynamiczne dodawanie nowych elementów z wydajnym wykorzystaniem pamięci
- Stały czas dodawania i usuwania elementów w znanym miejscu w pamięci
- Nie wymaga pre-alokacji większego obszaru pamięci
- Łatwa organizacja poprzez przestawienie wskaźników

**Wady**
- Trzeba przejść przez wszystkie poprzednie elementy, żeby znaleźć szukany obiekt
- Pobieranie danych do pamięci podręcznej zajmuje dużo czasu przez rozproszone adresy pamięci
- Pojedynczy obiekt zajmuje więcej miejsca w pamięci

**Operacje**
- **Dodawanie:** dodawanie w znanej pozycji *O(1)*, dodawanie w innej pozycji *O(n)*
- **Usuwanie:** usuwanie ze znanej pozycji *O(1)*, usuwanie z innej pozycji *O(n)*
- **Przeszukiwanie:** szukanie wartości *O(n)*, dostęp do wybranej pozycji *O(n)*

## Tablica hashująca

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2Fl8dvV8AzxsXng1DSX2oVnWZltEggGy?alt=media&token=07355e9f-2162-4578-9be8-7b0c8e83bf4b)

**Opis**
To specjalny rodzaj tablicy, gdzie kluczem może być dowolny typ danych: liczba, tekst, obiekt. Wykorzystuje funkcję hashującą do obliczania indeksu w tablicy co pozwala na bardzo szybki dostęp do wartości pod podanym kluczem. Bardzo ważna jest dobra funkcja hashująca, gdyż to ona pozwoli zapobiec konfliktom między kluczami. Nowoczesne implementacje (jak Python dict czy Java HashMap) mają bardzo dobre funkcje hashujące i techniki rozwiązywania kolizji, dzięki czemu najgorszy przypadek *O(n)* jest w praktyce bardzo rzadki.

**Zalety**
- Stały czas wykonywanych operacji dodawania, usuwania i szukania wartości
- Elastyczne typy kluczy pozwalają na złożoną zależność między danymi
- Świetne do implementacji pamięci podręcznej i baz danych
- Naturalne mapowanie kluczy i wartości, nie trzeba wykorzystywać nic nie mówiących liczb jako kluczy

**Wady**
- Częste kolizje kluczy mogą doprowadzić do gorszej wydajności operacji *(O(1) -> O(n))*
- Zajmuje dużo miejsca w pamięci
- Wydajność zależy w bardzo dużej mierze od funkcji hashującej

**Operacje**
- **Dodawanie:** przeciętny przypadek *O(1)*, najgorszy przypadek *O(n)*
- **Usuwanie:** przeciętny przypadek *O(1)*, najgorszy przypadek *O(n)*
- **Przeszukiwanie:** przeciętny przypadek *O(1)*, najgorszy przypadek *O(n)*

## Zestaw

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2FkqMNkvdKTh2YnsEU3rmGVbNLDdxbGS?alt=media&token=a2f0399b-4935-40af-bfa9-da0d347dfe19)

**Opis**
Zestawy to kolekcje, które wymuszają unikalność danych przechowując każdą wartość maksymalnie raz. Typowo implementowane przy pomocy tablic hashujących lub zbalansowanych drzew zapewniając wydajne sprawdzanie istnienia wartości i operacje matematyczne.

**Zalety**
- Automatyczne zapewnianie unikalności danych
- Bardzo szybkie sprawdzanie istnienia wartości
- Wykonywanie szybkich operacji matematycznych (unie, różnice, krzyżowanie)

**Wady**
- Brak indeksowania oraz dostępu pozycyjnego
- Zajmuje więcej miejsca niż zwykłe tablice
- Trudne w wydajnej implementacji zapewniającej unikalność

**Operacje**
- **Dodawanie:** dodawanie elementu dla zestawów zaimplementowanych na tablicach hashujących *O(1)*, a dla drzew *O(log(n))*
- **Usuwanie:** usuwanie elementu dla zestawów zaimplementowanych na tablicach hashujących *O(1)*, a dla drzew *O(log(n))*
- **Przeszukiwanie:** szukanie elementu dla zestawów zaimplementowanych na tablicach hashujących *O(1)*, a dla drzew *O(log(n))*

## Stos

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2FbuxDqyRgmdvA1hm4Ce93yVHyZpqMVl?alt=media&token=f2c4b693-81f9-4ec6-adc8-b9329b4a6141)

**Opis**
Stos to abstrakcyjna struktura danych implementująca styl dostępu **FILO *(First In - Last Out)***. Sam w sobie nie jest oddzielną strukturą danych, tak jak tablice czy lista powiązana, a jedynie wykorzystuje różne implementacje zapewniając inny dostęp do danych. Elementy są dodawane i usuwane z tej samej strony, tak zwanej "góry stosu". Można sobie wyobrazić jak ustawianie książek na stosie, żeby dostać się na dół, trzeba najpierw usunąć wszystkie z góry.

**Zalety**
- Prosty i przewidywalny dostęp do danych
- Wydajna implementacja wykorzystując tablice
- Naturalne wykorzystanie w algorytmach rekurencyjnych

**Wady**
- Bardzo restrykcyjny dostęp do danych
- Żeby znaleźć wartość niżej, trzeba najpierw usunąć dane wyżej
- Każda operacja przeszukiwania wymaga tworzenie nowego stosu
- Nie nadaje się w problemach wymagających losowego dostępu do danych

**Operacje**
- **Dodawanie:** dodawanie na szczyt *O(1)*
- **Usuwanie:** usuwanie ze szczytu *O(1)*
- **Przeszukiwanie:** sprawdzanie górnego elementu *O(1)*, szukanie poszczególnej wartości *O(n)*

## Kolejka

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2F9ECsGjIHkih5uIn4tGycukH8rwGAVU?alt=media&token=05be3f8d-b336-41b4-a97f-f6d2d879900b)

**Opis**
Podobnie do stosu, kolejka to też abstrakcyjna struktura danych, ale implementuje styl dostępu **FIFO *(First In - First Out)***. Elementy dodawane są na tył, a usuwane od przodu, co zapewnia sprawiedliwe przetwarzanie danych w kolejności w jakiej je dodaliśmy. Wydajną implementację można uzyskać wykorzystując circular buffer lub podwójnie powiązaną listę.

**Zalety**
- Przetwarzanie danych dokładnie w kolejności w jakiej je dodaliśmy
- Idealny do modelowania rzeczywistych systemów oczekiwania
- Doskonały do algorytmów przechodzenia wszerz i przetwarzania poziomowego

**Wady**
- Wymaga wydajnego zaimplementowania (circular buffer), aby uniknąć operacji o złożoności *O(n)* przy usuwaniu z przodu zwykłej tablicy
- Bardziej złożony niż stos, wymagający 2 kierunkowego dostępu
- Limitowany dostęp do danych wewnątrz

**Operacje**
- **Dodawanie:** dodawanie elementów od tyłu *O(1)* z poprawną implementacją
- **Usuwanie:** usuwanie elementów od przodu *O(1)* z poprawną implementacją
- **Przeszukiwanie:** sprawdzanie pierwszego elementu *O(1)*, szukanie poszczególnej wartości *O(n)*

## Drzewa

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2F83XGx2QXOPTkffeFw5MPwNuNFaDNfY?alt=media&token=1ef865fa-2fe4-4bac-918f-4e7fd9bbdaa8)

**Opis**
Drzewa to hierarchiczna struktura danych zawierająca węzły połączone krawędziami, z jednego węzła do drugiego zawsze jest tylko 1 połączenie. Drzewo zawsze zaczyna się od jednego elementu, tak zwanego **"korzenia"**, w przypadku zwykłych drzew każdy węzęł może posiadać zero lub wiele potomnych węzłów tworząc relacje rodzic-dziecko pomiędzy węzłami. Popularne samobalansujące się implementacje to drzewa AVL i Red-Black.

**Zalety**
- Naturalna reprezentacja hierarchicznych struktur
- Wydajne przeszukiwanie oraz sortowanie w przypadku zbalansowanych drzew
- Algorytmy rekurencyjne naturalnie mapują struktury drzew
- Elastyczna organizacja wspierająca różne sposoby dostępu do danych

**Wady**
- Bardziej złożona implementacja niż liniowe struktury danych
- Wydajność bardzo zależy od zbalansowania drzewa
- Rekurencyjne operacje może powodować przepełnienie stosu programu
- Wymaga bardzo uważnego balansu, żeby utrzymać optymalne operacje

**Operacje**
- **Dodawanie:** dodawanie węzła w przypadku zbalansowanego drzewa *O(log(n))*, w najgorszym przypadku *O(n)*
- **Usuwanie:** usuwanie węzła w przypadku zbalansowanego drzewa *O(log(n))*, w najgorszym przypadku *O(n)*
- **Przeszukiwanie:** szukanie wartości w przypadku zbalansowanego drzewa *O(log(n))*, w najgorszym przypadku *O(n)*

## Graf

![](https://firebasestorage.googleapis.com/v0/b/flagship-8de31.firebasestorage.app/o/blogs%2FJhXKjxXTnDP6s4mkahUWoVgLxAeSVg?alt=media&token=7cf55164-45c8-4983-b011-c32b3450fbf1)

**Opis**
Grafy to kolekcje wierzchołków połączonych krawędziami reprezentującymi relacje pomiędzy wartościami. Mogą być jedno lub dwu kierunkowe, ważone - nieważone lub cykliczne, dzięki czemu mogą być najbardziej zróżnicowane wśród struktur danych. Złożoności operacji bardzo zależą od sposobu reprezentacji - poniższe dotyczą reprezentacji za pomocą listy sąsiedztwa.

**Zalety**
- Najbardziej zróżnicowana struktura danych dla modelowania złożonych relacji
- Naturalna reprezentacja sieci, zależności i połączeń

**Wady**
- Najbardziej złożona struktura danych do implementacji i utrzymywania
- Algorytmy często charakteryzują się dużą złożonością obliczeniową
- Intensywne pod względem pamięci, szczególnie w przypadku gęstych połączeń
- Wykrywanie cykli i zarządzanie nimi zwiększa złożoność

**Operacje**
- **Dodawanie:** dodanie wierzchołka *O(1)*, dodanie krawędzi *O(1)*
- **Usuwanie:** usuwanie wierzchołka *O(V + E) (gdzie V - liczba wierzchołków, E - liczba krawędzi)*, usuwanie krawędzi *O(E)*
- **Przeszukiwanie:** szukanie wierzchołka *O(V)*, droga między wierzchołkami po krawędziach *O(V + E)*

## Podsumowanie

| Struktura | Opis | Zastosowania | Największa zaleta | Największa wada | Dodawanie | Usuwanie | Przeszukiwanie |
|---|---|---|---|---|---|---|---|
| **Tablica** | Elementy w ciągłej pamięci z dostępem przez indeks | Bufory danych, macierze matematyczne | Stały czas dostępu *O(1)* | Statyczny rozmiar, kosztowne wstawianie | *O(1)* | *O(n)* | *O(1)* |
| **Lista powiązana** | Węzły połączone wskaźnikami | Implementacja stosów/kolejek, edytory tekstu | Dynamiczny rozmiar | Brak dostępu przez indeks | *O(1)* | *O(1)* | *O(n)* |
| **Tablica hashująca** | Mapowanie klucz-wartość przez funkcję hash | Bazy danych, cache, słowniki | Bardzo szybki dostęp przez klucz | Kolizje mogą pogorszyć wydajność | *O(1)* | *O(1)* | *O(1)* |
| **Zestaw** | Kolekcja unikalnych elementów | Operacje matematyczne, deduplikacja | Automatyczna unikalność | Brak dostępu pozycyjnego | *O(1)* | *O(1)* | *O(1)* |
| **Stos** | LIFO - ostatni wchodzi, pierwszy wychodzi | Wywołania funkcji, parsowanie wyrażeń | Prostota implementacji | Bardzo ograniczony dostęp | *O(1)* | *O(1)* | *O(n)* |
| **Kolejka** | FIFO - pierwszy wchodzi, pierwszy wychodzi | Systemy kolejkowania, algorytmy BFS | Sprawiedliwe przetwarzanie | Złożoność implementacji | *O(1)* | *O(1)* | *O(n)* |
| **Drzewo** | Hierarchiczna struktura z korzeniem | Systemy plików, drzewa decyzyjne | Wydajne przeszukiwanie w strukturze | Wymaga balansowania | *O(log n)* | *O(log n)* | *O(log n)* |
| **Graf** | Wierzchołki połączone krawędziami | Sieci społecznościowe, mapy, routing | Modeluje złożone relacje | Bardzo złożona implementacja | *O(1)* | *O(V+E)* | *O(V+E)* |
