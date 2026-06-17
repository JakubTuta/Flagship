## Algorytmy przeszukiwania zbiorów danych

### Przeszukiwanie liniowe *(Linear Search)*

**Opis**
Sekwencyjne sprawdzanie wszystkich elementów po kolei, porównując czy obecny element to poszukiwana wartość.

**Kiedy jest wykorzystywane**
- Nieposortowane dane.
- Mały zestaw danych.
- Kiedy trzeba użyć prostej implementacji.

**Wykorzystanie w backendzie**
- Skanowanie plików log.
- Debugowanie aplikacji.
- Przeszukiwanie małych kolekcji w pamięci.

**Złożoność algorytmu: *O(n)***

### Przeszukiwanie binarne *(Binary Search)*

**Opis**
Wielokrotne dzielenie posortowanego zbioru danych na pół, za każdym razem eliminując połowę pozostałego zbioru danych. Uproszczone kroki algorytmu:
1. Sprawdzamy środkową wartość zbioru i porównujemy ją z poszukiwaną wartością.
2. Jeżeli szukana wartość jest większa, wybieramy prawą połowę zbioru danych, lub lewą w przeciwnym wypadku.
3. Kontynuujemy aż zostanie jeden element.

**Kiedy jest wykorzystywane**
- Posortowany zbiór danych.
- Ogromne zbiory danych.
- Indeksowanie bazy danych.

**Wykorzystanie w backendzie**
- Indeksy B-tree w bazach danych.
- Przeszukiwanie posortowanych tablic w pamięci.
- Systemy zarządzania bibliotekami i katalogami.

**Złożoność algorytmu: *O(log(n))***

### Przeszukiwanie oparte na hashu *(Hash-Based Search)*

**Opis**
Wykorzystanie funkcji hashującej do obliczenia pozycji danej wartości, co pozwala na bezpośredni dostęp do wartości. Wymaga zapisania danych jako para klucz-wartość.

**Kiedy jest wykorzystywane**
- Tokeny autentykacji.
- Zarządzanie sesją.
- Szybkie wyszukiwanie unikalnych identyfikatorów.

**Wykorzystanie w backendzie**
- Indeksy baz danych wykorzystujące hash.
- Tabele routingu.
- Walidacja kluczy API.
- Cache'owanie w Redis/Memcached.
- Elasticsearch dla wyszukiwania pełnotekstowego.

**Złożoność algorytmu: *O(1)***

### Przeszukiwanie interpolacyjne *(Interpolation Search)*

**Opis**
Udoskonalenie przeszukiwania binarnego, które zamiast zawsze dzielić zbiór na pół, próbuje zgadnąć lepszą pozycję na podstawie wartości szukanego elementu. Działa najlepiej dla równomiernie rozłożonych danych.

**Kiedy jest wykorzystywane**
- Równomiernie rozłożone, posortowane dane numeryczne.
- Duże zbiory danych z przewidywalnym rozkładem.
- Systemy wymagające bardzo szybkiego wyszukiwania.

**Wykorzystanie w backendzie**
- Indeksowanie danych czasowych w bazach danych.
- Systemy analityczne przetwarzające duże wolumeny danych.
- Wyszukiwanie w posortowanych plikach CSV.

**Złożoność algorytmu: *O(log(log(n)))* dla równomiernie rozłożonych danych, *O(n)* w najgorszym przypadku**

## Algorytmy sortowania

Wyjaśnienie niektórych pojęć:
- **Sortowanie w miejscu:** algorytm nie wymaga tworzenia dodatkowego miejsca w pamięci.
- **Sortowanie stabilne:** oznacza zachowanie oryginalnej pozycji w przypadku takich samych wartości.

### Sortowanie bąbelkowe *(Bubble Sort)*

**Opis**
Powtarzalne przechodzenie przez zbiór danych, porównując sąsiednie elementy i zamieniając je miejscami w przypadku niepoprawnej kolejności. Największe lub najmniejsze pozostałe elementy "wypływają" na koniec zbioru danych jak bąbelki powietrza w wodzie. Uproszczone kroki algorytmu w przypadku sortowania rosnącego:
1. Porównujemy dwa pierwsze elementy, jeżeli pierwszy jest większy to zamieniamy je miejscami, jeżeli drugi jest większy to zostawiamy je w obecnej kolejności.
2. Przechodzimy o jeden element dalej i powtarzamy poprzedni krok.
3. Gdy dojdziemy na koniec zbioru danych, wracamy na początek zbioru danych i powtarzamy cały proces.

**Kiedy jest wykorzystywane**
- Do nauki sortowania.
- Małe zbiory danych.
- Kiedy trzeba użyć prostej implementacji.

**Wykorzystanie w backendzie**
- Ze względu na złą złożoność algorytm nie jest wykorzystywany na produkcji.

**Złożoność algorytmu: *O(n²)***

### Sortowanie przez wstawianie *(Insertion Sort)*

**Opis**
Buduje posortowaną tablicę jeden element na raz, wstawiając każdy nowy element we właściwe miejsce wśród już posortowanych elementów. Podobne do sortowania kart w ręku. Uproszczone kroki algorytmu w przypadku sortowania rosnącego:
1. Rozpoczynamy od drugiego elementu (pierwszy traktujemy jako już posortowany).
2. Porównujemy obecny element z elementami po lewej stronie i wstawiamy go we właściwe miejsce.
3. Powtarzamy dla każdego następnego elementu.

**Kiedy jest wykorzystywane**
- Małe zbiory danych (do ~50 elementów).
- Częściowo posortowane dane.
- Jako część hybrydowych algorytmów sortowania.

**Wykorzystanie w backendzie**
- Część algorytmu Timsort (Python, Java).
- Sortowanie małych fragmentów w QuickSort.
- Sortowanie w czasie rzeczywistym przy napływających danych.

**Złożoność algorytmu: *O(n²)*, ale *O(n)* dla już posortowanych danych**

### Sortowanie przez scalanie *(Merge Sort)*

**Opis**
Dzielenie tablicy rekurencyjnie na pół, aż zostaną pojedyncze elementy, następnie zbiory są ze sobą scalane w posortowany sposób, sprawiając że algorytm tworzy i łączy posortowane fragmenty w większe, aż osiągnie pełny i posortowany zbiór danych. Uproszczone kroki algorytmu w przypadku sortowania rosnącego:
1. Dzielimy cały zbiór danych na mniejsze części, aż dojdziemy do pojedynczych elementów.
2. Scalamy mniejsze zbiory w większe, układając elementy po kolei w posortowany sposób.
3. Powtarzamy aż zostanie ostatni zbiór danych.

**Kiedy jest wykorzystywane**
- Ogromne zbiory danych.
- Kiedy wymagane jest stabilne sortowanie.
- Sortowanie zewnętrzne (dane nie mieszczą się w pamięci).

**Wykorzystanie w backendzie**
- Sortowanie baz danych.
- Rozproszone przetwarzanie danych (MapReduce).
- Systemy wymagające przewidywalnej wydajności.

**Złożoność algorytmu: *O(n log(n))***

### Szybkie sortowanie *(Quick Sort)*

**Opis**
Polega na wyborze elementu przewodniego *(pivot)* i podziale zbioru na dwie części: elementy mniejsze od pivota po lewej stronie i większe po prawej. Proces jest powtarzany rekurencyjnie dla każdej części. Uproszczone kroki algorytmu w przypadku sortowania rosnącego:
1. Wybieramy *pivot* (może to być pierwszy, ostatni lub losowy element).
2. Reorganizujemy zbiór tak, aby elementy mniejsze od pivota znalazły się po jego lewej stronie, a większe po prawej.
3. Rekurencyjnie stosujemy ten sam proces dla lewej i prawej części.
4. Gdy każda część ma jeden element lub jest pusta, sortowanie jest zakończone.

**Kiedy jest wykorzystywane**
- Jeden z najpowszechniejszych algorytmów sortowania.
- Kiedy wymagane jest sortowanie w miejscu.
- Średnie i duże zbiory danych.

**Wykorzystanie w backendzie**
- Część hybrydowych algorytmów (np. Introsort w C++).
- Optymalizacja zapytań bazy danych.
- Generalne przetwarzanie danych.

**Złożoność algorytmu: *O(n log(n))* średnio, *O(n²)* w najgorszym przypadku**

### Sortowanie przez kopcowanie *(Heap Sort)*

**Opis**
Wykorzystuje właściwości struktury danych kopca (heap), przekształcając tablicę w kopiec maksymalny, a następnie wielokrotnie wydobywając największy element i umieszczając go na końcu tablicy. Uproszczone kroki algorytmu w przypadku sortowania rosnącego:
1. Budujemy kopiec maksymalny z nieposortowanej tablicy (największy element na początku).
2. Zamieniamy pierwszy element (największy) z ostatnim.
3. Zmniejszamy rozmiar kopca o jeden i przywracamy właściwość kopca.
4. Powtarzamy kroki 2-3 aż kopiec będzie pusty.

**Kiedy jest wykorzystywane**
- Kiedy wymagana jest gwarantowana złożoność *O(n log(n))*.
- Kiedy istnieje ograniczenie pamięci (sortowanie w miejscu).
- Systemy czasu rzeczywistego.

**Wykorzystanie w backendzie**
- Kolejka priorytetowa.
- Planowanie zadań w systemach operacyjnych.
- Systemy alokacji zasobów.

**Złożoność algorytmu: *O(n log(n))***

### Sortowanie pozycyjne *(Radix Sort)*

**Opis**
Algorytm sortowania nieprzechodniego, który sortuje liczby cyfra po cyfrze, rozpoczynając od najmniej znaczącej cyfry. Nie porównuje elementów między sobą, ale grupuje je według poszczególnych cyfr. Uproszczone kroki algorytmu:
1. Sortujemy wszystkie liczby według ostatniej cyfry.
2. Następnie sortujemy według przedostatniej cyfry (zachowując kolejność z poprzedniego kroku).
3. Kontynuujemy dla każdej cyfry, aż dojdziemy do pierwszej cyfry.

**Kiedy jest wykorzystywane**
- Sortowanie liczb całkowitych lub stringów o stałej długości.
- Bardzo duże zbiory danych z ograniczoną domeną wartości.
- Kiedy potrzebujemy sortowania liniowego.

**Wykorzystanie w backendzie**
- Sortowanie IP adresów.
- Sortowanie identyfikatorów numerycznych.
- Systemy przetwarzania dużych wolumenów danych numerycznych.

**Złożoność algorytmu: *O(d × n)*, gdzie d to liczba cyfr**

## Algorytmy grafów / szukania drogi

Wyjaśnienie pojęć:
- **Graf nieważony:** graf, w którym krawędzie są jednakowe, nie mają żadnej wagi/ceny przejścia przez nie.
- **Graf ważony:** graf, w którym każda krawędź ma jakąś wagę.

Odnośnie złożoności algorytmów:
- **V** - ilość węzłów
- **E** - ilość krawędzi

### Przeszukiwanie wszerz *(Breadth-First Search, BFS)*

**Opis**
Przeszukiwanie grafu poziom po poziomie, odwiedzając najpierw wszystkich sąsiadów obecnego wierzchołka, zanim przejdziemy do kolejnych poziomów. Algorytm wykorzystuje kolejkę jako strukturę danych. Uproszczone kroki algorytmu:
1. Dodajemy węzeł startowy do kolejki i oznaczamy jako odwiedzony.
2. Usuwamy pierwszy element z kolejki, przetwarzamy go i dodajemy wszystkich jego nieodwiedzonych sąsiadów do kolejki.
3. Powtarzamy krok 2 aż kolejka będzie pusta.

**Kiedy jest wykorzystywane**
- Do szukania najkrótszej ścieżki w grafach nieważonych.
- Przeszukiwanie poziom po poziomie.
- Znajdowanie wszystkich węzłów w określonej odległości.

**Wykorzystanie w backendzie**
- Sugestie znajomych na portalach społecznościowych.
- Analizowanie topologii sieci.
- Przeszukiwanie sieci web.
- Znajdowanie najkrótszej drogi w grach (gdy wszystkie ruchy mają ten sam koszt).

**Złożoność algorytmu: *O(V + E)***

### Przeszukiwanie w głąb *(Depth-First Search, DFS)*

**Opis**
Przechodzenie po grafie eksplorując jak najgłębiej wzdłuż każdej ścieżki przed cofnięciem się i eksplorować inne ścieżki. Wykorzystuje stos jako strukturę danych oraz często implementowany rekurencyjnie. Uproszczone kroki algorytmu:
1. Dodajemy węzeł startowy na stos i oznaczamy jako odwiedzony.
2. Pobieramy ostatni węzeł ze stosu, przetwarzamy go i dodajemy wszystkich jego nieodwiedzonych sąsiadów na stos.
3. Powtarzamy krok 2 aż stos będzie pusty.

**Kiedy jest wykorzystywane**
- Sortowanie topologiczne.
- Wykrywanie cykli w grafie.
- Znajdowanie silnie połączonych składowych.
- Przechodzenie przez drzewa i struktury hierarchiczne.

**Wykorzystanie w backendzie**
- Przechodzenie po systemach plików.
- Wykrywanie zakleszczeń (deadlocks) pomiędzy wątkami.
- Analiza zależności w kodzie.
- Parsowanie struktur zagnieżdżonych.

**Złożoność algorytmu: *O(V + E)***

### Algorytm Dijkstry

**Opis**
Algorytm działający na grafach ważonych z nieujemnymi wagami, znajdujący najkrótsze ścieżki od węzła startowego do wszystkich innych węzłów. Gwarantuje znalezienie optymalnej (najkrótszej) ścieżki. Wykorzystuje kolejkę priorytetową do wybierania węzła z najmniejszym kosztem dotarcia. Uproszczone kroki algorytmu:
1. Ustawiamy koszt dotarcia do węzła startowego na 0, a do wszystkich innych na nieskończoność.
2. Dodajemy wszystkie węzły do kolejki priorytetowej.
3. Wybieramy węzeł z najmniejszym kosztem i aktualizujemy koszty dotarcia do jego sąsiadów.
4. Powtarzamy krok 3 aż wszystkie węzły zostaną przetworzone.

**Kiedy jest wykorzystywane**
- Szukanie najkrótszej ścieżki w grafach ważonych z nieujemnymi wagami.
- Routing sieciowy.
- Problemy optymalizacji tras.

**Wykorzystanie w backendzie**
- Systemy GPS i nawigacji.
- Routing pakietów sieciowych (protokoły OSPF).
- Planowanie tras dostaw.
- Optymalizacja kosztów w sieciach.

**Złożoność algorytmu: *O((V + E) log(V))***

### Algorytm Bellmana-Forda

**Opis**
Algorytm znajdowania najkrótszych ścieżek w grafach ważonych, który w przeciwieństwie do algorytmu Dijkstry może obsługiwać ujemne wagi krawędzi. Dodatkowo wykrywa ujemne cykle w grafie. Uproszczone kroki algorytmu:
1. Inicjalizujemy odległości: 0 do węzła startowego, nieskończoność do pozostałych.
2. Powtarzamy V-1 razy: dla każdej krawędzi próbujemy poprawić odległość do węzła docelowego.
3. Sprawdzamy czy istnieje ujemny cykl wykonując jeszcze jedno przejście.

**Kiedy jest wykorzystywane**
- Grafy z ujemnymi wagami krawędzi.
- Wykrywanie ujemnych cykli.
- Problemy arbitrażu finansowego.

**Wykorzystanie w backendzie**
- Systemy finansowe (arbitraż walutowy).
- Analiza różnic potencjałów w sieciach.
- Optymalizacja w grach (zyski/straty).

**Złożoność algorytmu: *O(V × E)***

### A gwiazdka *(A*, A-star)*

**Opis**
A* łączy w sobie najlepsze aspekty **algorytmu Dijkstry** (gwarancja najkrótszej ścieżki) z heurystyką kierującą przeszukiwanie w stronę celu. Wykorzystuje rzeczywisty koszt przejścia oraz szacowany koszt dotarcia do celu. Do obliczania najlepszej drogi wykorzystuje wzór `f(n) = g(n) + h(n)`, gdzie:
- `g(n)` - rzeczywisty koszt dotarcia do obecnego węzła z początku.
- `h(n)` - heurystyczne oszacowanie kosztu od obecnego węzła do celu (musi być admissible - nie może przeszacowywać).
- `f(n)` - szacowany pełny koszt dotarcia z początku do celu przez ten węzeł.

**Kiedy jest wykorzystywane**
- Szukanie najkrótszej ścieżki w grafach ważonych z dobrą heurystyką.
- Gdy chcemy unikać eksplorowania nieistotnych obszarów grafu.
- Problemy z określonym celem (punkt docelowy).

**Wykorzystanie w backendzie**
- Systemy GPS i nawigacji.
- Sztuczna inteligencja w grach.
- Robotyka i planowanie ruchu.
- Optymalizacja tras z ograniczeniami.

**Złożoność algorytmu: *O(E)* w najgorszym przypadku, znacznie lepiej z dobrą heurystyką**

### Algorytm Floyda-Warshalla

**Opis**
Algorytm znajdowania najkrótszych ścieżek pomiędzy wszystkimi parami węzłów w grafie ważonym. W przeciwieństwie do poprzednich algorytmów, które znajdują ścieżki z jednego węzła źródłowego, ten znajduje wszystkie możliwe najkrótsze ścieżki naraz. Uproszczone kroki algorytmu:
1. Inicjalizujemy macierz odległości: 0 na przekątnej, wagi krawędzi gdzie istnieją, nieskończoność gdzie nie ma połączenia.
2. Dla każdego możliwego węzła pośredniego k, sprawdzamy czy przejście przez k skraca ścieżkę między każdą parą węzłów.
3. Aktualizujemy odległości jeśli znajdziemy krótszą ścieżkę.

**Kiedy jest wykorzystywane**
- Gdy potrzebujemy najkrótszych ścieżek między wszystkimi parami węzłów.
- Małe i średnie grafy (ze względu na złożoność).
- Analiza dostępności w sieciach.

**Wykorzystanie w backendzie**
- Analiza sieci transportowych.
- Macierze odległości w systemach GIS.
- Optymalizacja komunikacji w sieciach.
- Analiza grafów społecznościowych.

**Złożoność algorytmu: *O(V³)***

## Algorytmy przeszukiwania drzew

### Przeszukiwanie w porządku wstępnym *(Pre-order Traversal)*

**Opis**
Odwiedzanie węzłów drzewa w kolejności: korzeń, lewe poddrzewo, prawe poddrzewo. Jest to naturalna implementacja rekurencyjna, która przetwarza najpierw węzeł rodzica, a następnie jego potomków. Uproszczone kroki algorytmu:
1. Przetwarzamy obecny węzeł (korzeń).
2. Rekurencyjnie przeszukujemy lewe poddrzewo.
3. Rekurencyjnie przeszukujemy prawe poddrzewo.

**Kiedy jest wykorzystywane**
- Kopiowanie lub klonowanie drzewa.
- Tworzenie prefiksu wyrażeń matematycznych.
- Przechodzenie przez struktury katalogów.

**Wykorzystanie w backendzie**
- Serializacja drzew do formatów JSON/XML.
- Przechodzenie po strukturze plików.
- Parsowanie wyrażeń w kompilatorach.

**Złożoność algorytmu: *O(n)***

### Przeszukiwanie w porządku środkowym *(In-order Traversal)*

**Opis**
Odwiedzanie węzłów drzewa w kolejności: lewe poddrzewo, korzeń, prawe poddrzewo. W przypadku drzewa wyszukiwania binarnego (BST) daje posortowaną sekwencję wartości. Uproszczone kroki algorytmu:
1. Rekurencyjnie przeszukujemy lewe poddrzewo.
2. Przetwarzamy obecny węzeł (korzeń).
3. Rekurencyjnie przeszukujemy prawe poddrzewo.

**Kiedy jest wykorzystywane**
- Pobieranie danych w porządku posortowanym z BST.
- Walidacja czy drzewo jest poprawnym BST.
- Konwersja drzewa do posortowanej tablicy.

**Wykorzystanie w backendzie**
- Pobieranie danych z indeksów bazodanowych.
- Sortowanie danych przechowywanych w drzewie.
- Walidacja struktur danych w bazach.

**Złożoność algorytmu: *O(n)***

### Przeszukiwanie w porządku końcowym *(Post-order Traversal)*

**Opis**
Odwiedzanie węzłów drzewa w kolejności: lewe poddrzewo, prawe poddrzewo, korzeń. Węzeł rodzica jest przetwarzany dopiero po przetworzeniu wszystkich jego potomków. Uproszczone kroki algorytmu:
1. Rekurencyjnie przeszukujemy lewe poddrzewo.
2. Rekurencyjnie przeszukujemy prawe poddrzewo.
3. Przetwarzamy obecny węzeł (korzeń).

**Kiedy jest wykorzystywane**
- Usuwanie drzewa (dzieci przed rodzicem).
- Obliczanie rozmiaru poddrzew.
- Tworzenie postfixu wyrażeń matematycznych.

**Wykorzystanie w backendzie**
- Zwalnianie pamięci w strukturach drzewiastych.
- Obliczanie statystyk dla poddrzew.
- Parsowanie wyrażeń matematycznych.
- Garbage collection w językach programowania.

**Złożoność algorytmu: *O(n)***

## Algorytmy wyszukiwania wzorców w tekście

### Algorytm naiwny *(Brute Force String Search)*

**Opis**
Najprostszy algorytm wyszukiwania wzorca w tekście, który sprawdza każdą możliwą pozycję w tekście głównym, porównując znak po znaku z wzorcem. Gdy znaki się nie zgadzają, przesuwa się o jedną pozycję i rozpoczyna porównywanie od początku wzorca. Uproszczone kroki algorytmu:
1. Dla każdej pozycji i w tekście głównym sprawdzamy czy wzorzec pasuje.
2. Porównujemy wzorzec znak po znaku z tekstem głównym rozpoczynając od pozycji i.
3. Jeśli wszystkie znaki się zgadzają, znaleźliśmy dopasowanie.
4. Jeśli nie, przechodzimy do pozycji i+1 i powtarzamy.

**Kiedy jest wykorzystywane**
- Małe wzorce i teksty.
- Gdy prostota implementacji jest ważniejsza od wydajności.
- Jako podstawa do zrozumienia bardziej zaawansowanych algorytmów.

**Wykorzystanie w backendzie**
- Proste wyszukiwanie w małych plikach.
- Prototypowanie funkcji wyszukiwania.
- Edytory tekstu dla krótkich dokumentów.

**Złożoność algorytmu: *O(n × m)*, gdzie n - długość tekstu, m - długość wzorca**

### Algorytm Boyera-Moore'a

**Opis**
Zaawansowany algorytm wyszukiwania wzorców, który porównuje wzorzec z tekstem od prawej do lewej i wykorzystuje dwie heurystyki do przesuwania wzorca o więcej niż jedną pozycję przy niedopasowaniu. Heurystyki to "złe znaki" (bad character) i "dobry sufiks" (good suffix), co pozwala na pominięcie wielu porównań. Uproszczone kroki algorytmu:
1. Budujemy tabele heurystyk na podstawie wzorca.
2. Umieszczamy wzorzec na początku tekstu i porównujemy od końca wzorca.
3. Przy niedopasowaniu wykorzystujemy heurystyki do określenia o ile pozycji przesunąć wzorzec.
4. Powtarzamy aż znajdziemy dopasowanie lub dojdziemy do końca tekstu.

**Kiedy jest wykorzystywane**
- Długie teksty i wzorce.
- Gdy wydajność wyszukiwania jest kluczowa.
- Wyszukiwanie w dużych plikach tekstowych.

**Wykorzystanie w backendzie**
- Wyszukiwarki tekstu (grep, find).
- Antywirusowe skanowanie plików.
- Wyszukiwanie w bazach danych tekstowych.
- Edytory tekstu dla dużych plików.

**Złożoność algorytmu: *O(n/m)* w najlepszym przypadku, *O(n × m)* w najgorszym**

## Paradygmaty algorytmów

### Dziel i zwyciężaj *(Divide and Conquer)*

**Opis**
Paradygmat algorytmiczny, który rozwiązuje problem poprzez podział go na mniejsze, podobne podproblemy, rekurencyjne rozwiązywanie każdego z nich, a następnie łączenie wyników w rozwiązanie całości. Składa się z trzech etapów: dzielenie, rozwiązywanie i łączenie. Uproszczone kroki paradygmatu:
1. **Dziel:** Podziel problem na mniejsze podproblemy tego samego typu.
2. **Zwyciężaj:** Rozwiąż podproblemy rekurencyjnie (lub bezpośrednio jeśli są małe).
3. **Łącz:** Połącz rozwiązania podproblemów w rozwiązanie oryginalnego problemu.

**Kiedy jest wykorzystywane**
- Problemy, które można naturalnie podzielić na podobne podproblemy.
- Gdy podział prowadzi do znacznego uproszczenia.
- Problemy z optymalną podstrukturą.

**Wykorzystanie w backendzie**
- Sortowanie (Merge Sort, Quick Sort).
- Przeszukiwanie (Binary Search).
- Przetwarzanie obrazów i sygnałów.
- Systemy rozproszonych obliczeń (MapReduce).

**Przykłady algorytmów:** Merge Sort, Quick Sort, Binary Search, Fast Fourier Transform

### Algorytm zachłanny *(Greedy Algorithm)*

**Opis**
Paradygmat algorytmiczny, który podejmuje lokalnie optymalne decyzje w każdym kroku, mając nadzieję na znalezienie globalnego optimum. W każdym momencie wybiera opcję, która wydaje się najlepsza w danej chwili, bez rozważania przyszłych konsekwencji. Uproszczone kroki paradygmatu:
1. Rozpocznij z pustym rozwiązaniem.
2. W każdym kroku wybierz lokalnie najlepszą opcję.
3. Dodaj wybraną opcję do rozwiązania.
4. Powtarzaj aż problem zostanie rozwiązany.

**Kiedy jest wykorzystywane**
- Problemy z właściwością wyboru zachłannego.
- Gdy lokalne optimum prowadzi do globalnego optimum.
- Problemy optymalizacyjne z ograniczeniami.

**Wykorzystanie w backendzie**
- Algorytmy przeszukiwania grafów (Dijkstra).
- Kompresja danych (Huffman coding).
- Planowanie zadań i alokacja zasobów.
- Problemy pakowania i rozkładania.

**Przykłady algorytmów:** Algorytm Dijkstry, Kruskal (minimalne drzewo spinające), Huffman coding

### Technika dwóch wskaźników *(Two Pointers)*

**Opis**
Technika algorytmiczna wykorzystująca dwa wskaźniki (indeksy) do przechodzenia przez strukturę danych, zazwyczaj tablicę lub listę. Wskaźniki mogą się poruszać w tym samym kierunku (różna prędkość) lub w przeciwnych kierunkach. Pozwala na redukcję złożoności czasowej z O(n²) do O(n) w wielu problemach. Uproszczone kroki techniki:
1. Umieść wskaźniki w odpowiednich pozycjach startowych.
2. Przesuń wskaźniki zgodnie z logiką problemu.
3. W każdym kroku analizuj elementy wskazywane przez wskaźniki.
4. Kontynuuj aż wskaźniki się spotkają lub osiągnią warunki końcowe.

**Kiedy jest wykorzystywane**
- Problemy na posortowanych tablicach.
- Szukanie par elementów spełniających warunki.
- Problemy z oknami (sliding window).
- Wykrywanie cykli w strukturach danych.

**Wykorzystanie w backendzie**
- Wyszukiwanie w posortowanych danych.
- Walidacja palindromów.
- Algorytmy sortowania i scalania.
- Optymalizacja zapytań bazodanowych.
- Wykrywanie cykli w listach powiązanych.

**Przykłady problemów:** Two Sum na posortowanej tablicy, sprawdzanie palindromu, usuwanie duplikatów, najdłuższy substring bez powtórzeń

**Złożoność algorytmu: zazwyczaj *O(n)* zamiast *O(n²)***
