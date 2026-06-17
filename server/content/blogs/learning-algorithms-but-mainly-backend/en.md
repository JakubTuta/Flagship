## Data Set Search Algorithms

### Linear Search *(Linear Search)*

**Description**
Sequentially checking all elements one by one, comparing whether the current element is the desired value.

**When it is used**
- Unsorted data.
- Small data sets.
- When a simple implementation is required.

**Backend usage**
- Scanning log files.
- Application debugging.
- Searching small in-memory collections.

**Algorithm complexity: *O(n)***

### Binary Search *(Binary Search)*

**Description**
Repeatedly dividing a sorted data set in half, eliminating half of the remaining data set each time. Simplified algorithm steps:
1. We check the middle value of the set and compare it with the desired value.
2. If the desired value is greater, we choose the right half of the data set, or the left otherwise.
3. We continue until one element remains.

**When it is used**
- Sorted data set.
- Huge data sets.
- Database indexing.

**Backend usage**
- B-tree indexes in databases.
- Searching sorted arrays in memory.
- Library and catalog management systems.

**Algorithm complexity: *O(log(n))***

### Hash-Based Search *(Hash-Based Search)*

**Description**
Using a hashing function to calculate the position of a given value, which allows direct access to the value. Requires data to be stored as a key-value pair.

**When it is used**
- Authentication tokens.
- Session management.
- Fast lookup of unique identifiers.

**Backend usage**
- Hash-based database indexes.
- Routing tables.
- API key validation.
- Caching in Redis/Memcached.
- Elasticsearch for full-text search.

**Algorithm complexity: *O(1)***

### Interpolation Search *(Interpolation Search)*

**Description**
An improvement on binary search, which instead of always dividing the set in half, tries to guess a better position based on the value of the element being searched. Works best for uniformly distributed data.

**When it is used**
- Uniformly distributed, sorted numerical data.
- Large data sets with a predictable distribution.
- Systems requiring very fast searching.

**Backend usage**
- Indexing time-series data in databases.
- Analytical systems processing large volumes of data.
- Searching in sorted CSV files.

**Algorithm complexity: *O(log(log(n)))* for uniformly distributed data, *O(n)* in the worst case**

## Sorting Algorithms

Explanation of some concepts:
- **In-place sorting:** the algorithm does not require creating additional memory space.
- **Stable sorting:** means preserving the original position in case of identical values.

### Bubble Sort *(Bubble Sort)*

**Description**
Repeatedly traversing through a data set, comparing adjacent elements and swapping them if they are in the wrong order. The largest or smallest remaining elements "bubble up" to the end of the data set like air bubbles in water. Simplified algorithm steps for ascending sort:
1. We compare the first two elements, if the first is larger, we swap them, if the second is larger, we leave them in the current order.
2. We move one element further and repeat the previous step.
3. When we reach the end of the data set, we return to the beginning of the data set and repeat the entire process.

**When it is used**
- For learning sorting.
- Small data sets.
- When a simple implementation is required.

**Backend usage**
- Due to poor complexity, the algorithm is not used in production.

**Algorithm complexity: *O(n²)***

### Insertion Sort *(Insertion Sort)*

**Description**
Builds a sorted array one element at a time, inserting each new element into its proper place among the already sorted elements. Similar to sorting cards in hand. Simplified algorithm steps for ascending sort:
1. We start from the second element (the first one is treated as already sorted).
2. We compare the current element with the elements to its left and insert it into the correct position.
3. We repeat for each subsequent element.

**When it is used**
- Small data sets (up to ~50 elements).
- Partially sorted data.
- As part of hybrid sorting algorithms.

**Backend usage**
- Part of the Timsort algorithm (Python, Java).
- Sorting small segments in QuickSort.
- Real-time sorting with incoming data.

**Algorithm complexity: *O(n²)*, but *O(n)* for already sorted data**

### Merge Sort *(Merge Sort)*

**Description**
Recursively dividing an array in half until individual elements remain, then the sets are merged in a sorted manner, causing the algorithm to create and combine sorted fragments into larger ones until a complete and sorted data set is achieved. Simplified algorithm steps for ascending sort:
1. We divide the entire data set into smaller parts until we reach individual elements.
2. We merge smaller sets into larger ones, arranging elements sequentially in a sorted manner.
3. We repeat until the last data set remains.

**When it is used**
- Huge data sets.
- When stable sorting is required.
- External sorting (data does not fit in memory).

**Backend usage**
- Database sorting.
- Distributed data processing (MapReduce).
- Systems requiring predictable performance.

**Algorithm complexity: *O(n log(n))***

### Quick Sort *(Quick Sort)*

**Description**
It involves choosing a pivot element *(pivot)* and dividing the set into two parts: elements smaller than the pivot on the left and larger on the right. The process is repeated recursively for each part. Simplified algorithm steps for ascending sort:
1. We choose a *pivot* (it can be the first, last, or a random element).
2. We reorganize the set so that elements smaller than the pivot are on its left side, and larger ones on its right.
3. We recursively apply the same process to the left and right parts.
4. When each part has one element or is empty, the sorting is complete.

**When it is used**
- One of the most common sorting algorithms.
- When in-place sorting is required.
- Medium and large data sets.

**Backend usage**
- Part of hybrid algorithms (e.g., Introsort in C++).
- Database query optimization.
- General data processing.

**Algorithm complexity: *O(n log(n))* on average, *O(n²)* in the worst case**

### Heap Sort *(Heap Sort)*

**Description**
Utilizes the properties of the heap data structure, transforming the array into a max-heap, and then repeatedly extracting the largest element and placing it at the end of the array. Simplified algorithm steps for ascending sort:
1. We build a max-heap from the unsorted array (largest element at the beginning).
2. We swap the first (largest) element with the last element.
3. We reduce the size of the heap by one and restore the heap property.
4. We repeat steps 2-3 until the heap is empty.

**When it is used**
- When a guaranteed complexity of *O(n log(n))* is required.
- When memory is limited (in-place sorting).
- Real-time systems.

**Backend usage**
- Priority queue.
- Task scheduling in operating systems.
- Resource allocation systems.

**Algorithm complexity: *O(n log(n))***

### Radix Sort *(Radix Sort)*

**Description**
A non-comparison sorting algorithm that sorts numbers digit by digit, starting from the least significant digit. It does not compare elements with each other, but groups them according to individual digits. Simplified algorithm steps:
1. We sort all numbers according to the last digit.
2. Then we sort according to the second to last digit (maintaining the order from the previous step).
3. We continue for each digit until we reach the first digit.

**When it is used**
- Sorting integers or fixed-length strings.
- Very large data sets with a limited value domain.
- When linear sorting is needed.

**Backend usage**
- Sorting IP addresses.
- Sorting numerical identifiers.
- Systems processing large volumes of numerical data.

**Algorithm complexity: *O(d × n)*, where d is the number of digits**

## Graph / Pathfinding Algorithms

Explanation of concepts:
- **Unweighted graph:** a graph where edges are uniform, they do not have any weight/cost to traverse.
- **Weighted graph:** a graph where each edge has some weight.

Regarding algorithm complexity:
- **V** - number of nodes
- **E** - number of edges

### Breadth-First Search *(Breadth-First Search, BFS)*

**Description**
Graph traversal level by level, visiting all neighbors of the current vertex first, before moving to subsequent levels. The algorithm uses a queue as a data structure. Simplified algorithm steps:
1. We add the starting node to the queue and mark it as visited.
2. We remove the first element from the queue, process it, and add all its unvisited neighbors to the queue.
3. We repeat step 2 until the queue is empty.

**When it is used**
- For finding the shortest path in unweighted graphs.
- Level-by-level traversal.
- Finding all nodes within a certain distance.

**Backend usage**
- Friend suggestions on social media platforms.
- Analyzing network topology.
- Web crawling.
- Finding the shortest path in games (when all moves have the same cost).

**Algorithm complexity: *O(V + E)***

### Depth-First Search *(Depth-First Search, DFS)*

**Description**
Traversing a graph by exploring as deeply as possible along each path before backtracking and exploring other paths. It uses a stack as a data structure and is often implemented recursively. Simplified algorithm steps:
1. We add the starting node to the stack and mark it as visited.
2. We pop the last node from the stack, process it, and push all its unvisited neighbors onto the stack.
3. We repeat step 2 until the stack is empty.

**When it is used**
- Topological sorting.
- Cycle detection in a graph.
- Finding strongly connected components.
- Traversing trees and hierarchical structures.

**Backend usage**
- Traversing file systems.
- Deadlock detection between threads.
- Code dependency analysis.
- Parsing nested structures.

**Algorithm complexity: *O(V + E)***

### Dijkstra's Algorithm

**Description**
An algorithm operating on weighted graphs with non-negative weights, finding the shortest paths from a starting node to all other nodes. It guarantees finding the optimal (shortest) path. It uses a priority queue to select the node with the smallest arrival cost. Simplified algorithm steps:
1. We set the cost to reach the starting node to 0, and to all others to infinity.
2. We add all nodes to the priority queue.
3. We select the node with the smallest cost and update the costs to reach its neighbors.
4. We repeat step 3 until all nodes have been processed.

**When it is used**
- Finding the shortest path in weighted graphs with non-negative weights.
- Network routing.
- Route optimization problems.

**Backend usage**
- GPS and navigation systems.
- Network packet routing (OSPF protocols).
- Delivery route planning.
- Cost optimization in networks.

**Algorithm complexity: *O((V + E) log(V))***

### Bellman-Ford Algorithm

**Description**
An algorithm for finding shortest paths in weighted graphs, which, unlike Dijkstra's algorithm, can handle negative edge weights. Additionally, it detects negative cycles in the graph. Simplified algorithm steps:
1. We initialize distances: 0 to the starting node, infinity to the others.
2. We repeat V-1 times: for each edge, we try to improve the distance to the target node.
3. We check for negative cycles by performing one more pass.

**When it is used**
- Graphs with negative edge weights.
- Negative cycle detection.
- Financial arbitrage problems.

**Backend usage**
- Financial systems (currency arbitrage).
- Analysis of potential differences in networks.
- Optimization in games (profits/losses).

**Algorithm complexity: *O(V × E)***

### A-star *(A*, A-star)*

**Description**
A* combines the best aspects of **Dijkstra's algorithm** (guarantee of the shortest path) with a heuristic guiding the search towards the goal. It uses the actual cost of traversal and an estimated cost to reach the goal. To calculate the best path, it uses the formula `f(n) = g(n) + h(n)`, where:
- `g(n)` - the actual cost to reach the current node from the start.
- `h(n)` - a heuristic estimate of the cost from the current node to the goal (must be admissible - cannot overestimate).
- `f(n)` - the estimated total cost to reach the goal from the start through this node.

**When it is used**
- Finding the shortest path in weighted graphs with a good heuristic.
- When we want to avoid exploring irrelevant areas of the graph.
- Problems with a specific goal (destination point).

**Backend usage**
- GPS and navigation systems.
- Artificial intelligence in games.
- Robotics and motion planning.
- Route optimization with constraints.

**Algorithm complexity: *O(E)* in the worst case, significantly better with a good heuristic**

### Floyd-Warshall Algorithm

**Description**
An algorithm for finding the shortest paths between all pairs of nodes in a weighted graph. Unlike previous algorithms, which find paths from a single source node, this one finds all possible shortest paths at once. Simplified algorithm steps:
1. We initialize the distance matrix: 0 on the diagonal, edge weights where they exist, infinity where there is no connection.
2. For each possible intermediate node k, we check if traversing through k shortens the path between every pair of nodes.
3. We update distances if we find a shorter path.

**When it is used**
- When shortest paths between all pairs of nodes are needed.
- Small and medium graphs (due to complexity).
- Network availability analysis.

**Backend usage**
- Transportation network analysis.
- Distance matrices in GIS systems.
- Optimizing network communication.
- Social graph analysis.

**Algorithm complexity: *O(V³)***

## Tree Traversal Algorithms

### Pre-order Traversal *(Pre-order Traversal)*

**Description**
Visiting tree nodes in the order: root, left subtree, right subtree. This is a natural recursive implementation that processes the parent node first, then its children. Simplified algorithm steps:
1. We process the current node (root).
2. We recursively traverse the left subtree.
3. We recursively traverse the right subtree.

**When it is used**
- Copying or cloning a tree.
- Creating prefixes of mathematical expressions.
- Traversing directory structures.

**Backend usage**
- Serialization of trees to JSON/XML formats.
- Traversing file structures.
- Parsing expressions in compilers.

**Algorithm complexity: *O(n)***

### In-order Traversal *(In-order Traversal)*

**Description**
Visiting tree nodes in the order: left subtree, root, right subtree. In the case of a binary search tree (BST), this yields a sorted sequence of values. Simplified algorithm steps:
1. We recursively traverse the left subtree.
2. We process the current node (root).
3. We recursively traverse the right subtree.

**When it is used**
- Retrieving data in sorted order from a BST.
- Validating if a tree is a correct BST.
- Converting a tree to a sorted array.

**Backend usage**
- Retrieving data from database indexes.
- Sorting data stored in a tree.
- Validating data structures in databases.

**Algorithm complexity: *O(n)***

### Post-order Traversal *(Post-order Traversal)*

**Description**
Visiting tree nodes in the order: left subtree, right subtree, root. The parent node is processed only after all its children have been processed. Simplified algorithm steps:
1. We recursively traverse the left subtree.
2. We recursively traverse the right subtree.
3. We process the current node (root).

**When it is used**
- Deleting a tree (children before parent).
- Calculating subtree size.
- Creating postfix of mathematical expressions.

**Backend usage**
- Releasing memory in tree structures.
- Calculating statistics for subtrees.
- Parsing mathematical expressions.
- Garbage collection in programming languages.

**Algorithm complexity: *O(n)***

## Text Pattern Matching Algorithms

### Naive Algorithm *(Brute Force String Search)*

**Description**
The simplest algorithm for searching a pattern in text, which checks every possible position in the main text, comparing character by character with the pattern. When characters do not match, it shifts one position and starts comparing from the beginning of the pattern. Simplified algorithm steps:
1. For each position i in the main text, we check if the pattern matches.
2. We compare the pattern character by character with the main text starting from position i.
3. If all characters match, we have found a match.
4. If not, we move to position i+1 and repeat.

**When it is used**
- Small patterns and texts.
- When simplicity of implementation is more important than performance.
- As a basis for understanding more advanced algorithms.

**Backend usage**
- Simple searching in small files.
- Prototyping search functions.
- Text editors for short documents.

**Algorithm complexity: *O(n × m)*, where n - text length, m - pattern length**

### Boyer-Moore Algorithm

**Description**
An advanced pattern searching algorithm that compares the pattern with the text from right to left and uses two heuristics to shift the pattern by more than one position upon a mismatch. The heuristics are "bad character" and "good suffix", which allows skipping many comparisons. Simplified algorithm steps:
1. We build heuristic tables based on the pattern.
2. We place the pattern at the beginning of the text and compare from the end of the pattern.
3. Upon a mismatch, we use heuristics to determine how many positions to shift the pattern.
4. We repeat until a match is found or we reach the end of the text.

**When it is used**
- Long texts and patterns.
- When search performance is crucial.
- Searching in large text files.

**Backend usage**
- Text search engines (grep, find).
- Antivirus file scanning.
- Searching in text databases.
- Text editors for large files.

**Algorithm complexity: *O(n/m)* in the best case, *O(n × m)* in the worst**

## Algorithm Paradigms

### Divide and Conquer *(Divide and Conquer)*

**Description**
An algorithmic paradigm that solves a problem by dividing it into smaller, similar subproblems, recursively solving each of them, and then combining the results into a complete solution. It consists of three stages: divide, conquer, and combine. Simplified paradigm steps:
1. **Divide:** Divide the problem into smaller subproblems of the same type.
2. **Conquer:** Solve the subproblems recursively (or directly if they are small).
3. **Combine:** Combine the solutions of the subproblems into the solution of the original problem.

**When it is used**
- Problems that can be naturally divided into similar subproblems.
- When division leads to significant simplification.
- Problems with optimal substructure.

**Backend usage**
- Sorting (Merge Sort, Quick Sort).
- Searching (Binary Search).
- Image and signal processing.
- Distributed computing systems (MapReduce).

**Examples of algorithms:** Merge Sort, Quick Sort, Binary Search, Fast Fourier Transform

### Greedy Algorithm *(Greedy Algorithm)*

**Description**
An algorithmic paradigm that makes locally optimal decisions at each step, hoping to find a global optimum. At each moment, it chooses the option that seems best at that particular time, without considering future consequences. Simplified paradigm steps:
1. Start with an empty solution.
2. At each step, choose the locally best option.
3. Add the chosen option to the solution.
4. Repeat until the problem is solved.

**When it is used**
- Problems with the greedy choice property.
- When a local optimum leads to a global optimum.
- Optimization problems with constraints.

**Backend usage**
- Graph search algorithms (Dijkstra).
- Data compression (Huffman coding).
- Task scheduling and resource allocation.
- Packing and decomposition problems.

**Examples of algorithms:** Dijkstra's Algorithm, Kruskal (minimum spanning tree), Huffman coding

### Two Pointers Technique *(Two Pointers)*

**Description**
An algorithmic technique that uses two pointers (indices) to traverse a data structure, typically an array or a list. The pointers can move in the same direction (different speeds) or in opposite directions. It allows reducing time complexity from O(n²) to O(n) in many problems. Simplified technique steps:
1. Place pointers at appropriate starting positions.
2. Move pointers according to the problem logic.
3. At each step, analyze the elements pointed to by the pointers.
4. Continue until the pointers meet or reach terminal conditions.

**When it is used**
- Problems on sorted arrays.
- Finding pairs of elements that satisfy conditions.
- Sliding window problems.
- Cycle detection in data structures.

**Backend usage**
- Searching in sorted data.
- Palindrome validation.
- Sorting and merging algorithms.
- Database query optimization.
- Cycle detection in linked lists.

**Examples of problems:** Two Sum on a sorted array, palindrome checking, duplicate removal, longest substring without repeating characters

**Algorithm complexity: typically *O(n)* instead of *O(n²)***
