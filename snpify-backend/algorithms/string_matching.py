from typing import List, Tuple, Dict, Optional
import hashlib
import time
from abc import ABC, abstractmethod

class StringMatcher(ABC):
    """Abstract base class for string matching algorithms"""
    
    def __init__(self, pattern: str):
        self.pattern = pattern
        self.pattern_length = len(pattern)
        self.comparisons = 0
        self.matches = []
    
    @abstractmethod
    def search(self, text: str) -> List[int]:
        """Search for pattern in text and return list of positions"""
        pass
    
    def get_performance_metrics(self) -> Dict[str, any]:
        """Get algorithm performance metrics"""
        return {
            "comparisons": self.comparisons,
            "matches_found": len(self.matches),
            "pattern_length": self.pattern_length
        }

class BoyerMooreSearcher(StringMatcher):
    """Boyer-Moore string matching algorithm implementation"""
    
    def __init__(self, pattern: str):
        super().__init__(pattern.upper())
        self.bad_char_table = self._build_bad_character_table()
        self.good_suffix_table = self._build_good_suffix_table()
    
    def _build_bad_character_table(self) -> Dict[str, int]:
        """Build bad character table for Boyer-Moore algorithm"""
        table = {}
        
        # Initialize all characters to pattern length
        for i in range(256):  # ASCII characters
            table[chr(i)] = self.pattern_length
        
        # Set distances for characters in pattern
        for i in range(self.pattern_length - 1):
            table[self.pattern[i]] = self.pattern_length - 1 - i
        
        return table
    
    def _build_good_suffix_table(self) -> List[int]:
        """Build good suffix table for Boyer-Moore algorithm"""
        table = [0] * self.pattern_length
        last_prefix_index = self.pattern_length
        
        # Fill the good suffix table
        for i in range(self.pattern_length - 1, -1, -1):
            if self._is_prefix(i + 1):
                last_prefix_index = i + 1
            table[self.pattern_length - 1 - i] = last_prefix_index - i + self.pattern_length - 1
        
        # Handle suffixes
        for i in range(self.pattern_length - 1):
            suffix_length = self._suffix_length(i)
            table[suffix_length] = self.pattern_length - 1 - i + suffix_length
        
        return table
    
    def _is_prefix(self, pos: int) -> bool:
        """Check if pattern[pos:] is a prefix of pattern"""
        suffix_len = self.pattern_length - pos
        for i in range(suffix_len):
            if self.pattern[i] != self.pattern[pos + i]:
                return False
        return True
    
    def _suffix_length(self, pos: int) -> int:
        """Return length of longest suffix ending at pos"""
        length = 0
        i = pos
        j = self.pattern_length - 1
        
        while i >= 0 and self.pattern[i] == self.pattern[j]:
            length += 1
            i -= 1
            j -= 1
        
        return length
    
    def search(self, text: str) -> List[int]:
        """Boyer-Moore search implementation"""
        text = text.upper()
        text_length = len(text)
        matches = []
        self.comparisons = 0
        
        if self.pattern_length > text_length:
            return matches
        
        i = self.pattern_length - 1  # Start from end of pattern
        
        while i < text_length:
            j = self.pattern_length - 1
            
            # Compare pattern from right to left
            while j >= 0 and text[i] == self.pattern[j]:
                self.comparisons += 1
                i -= 1
                j -= 1
            
            if j < 0:
                # Pattern found
                matches.append(i + 1)
                i += self.good_suffix_table[0] + 1
            else:
                # Mismatch occurred
                self.comparisons += 1
                
                # Calculate shifts using bad character and good suffix rules
                bad_char_shift = self.bad_char_table.get(text[i], self.pattern_length)
                good_suffix_shift = self.good_suffix_table[self.pattern_length - 1 - j]
                
                # Take maximum of both shifts
                shift = max(bad_char_shift, good_suffix_shift)
                i += shift
        
        self.matches = matches
        return matches

class KMPSearcher(StringMatcher):
    """Knuth-Morris-Pratt string matching algorithm implementation"""
    
    def __init__(self, pattern: str):
        super().__init__(pattern.upper())
        self.failure_function = self._build_failure_function()
    
    def _build_failure_function(self) -> List[int]:
        """Build failure function (partial match table) for KMP algorithm"""
        failure = [0] * self.pattern_length
        j = 0
        
        for i in range(1, self.pattern_length):
            while j > 0 and self.pattern[i] != self.pattern[j]:
                j = failure[j - 1]
            
            if self.pattern[i] == self.pattern[j]:
                j += 1
            
            failure[i] = j
        
        return failure
    
    def search(self, text: str) -> List[int]:
        """KMP search implementation"""
        text = text.upper()
        text_length = len(text)
        matches = []
        self.comparisons = 0
        
        if self.pattern_length > text_length:
            return matches
        
        i = 0  # Index for text
        j = 0  # Index for pattern
        
        while i < text_length:
            self.comparisons += 1
            
            if text[i] == self.pattern[j]:
                i += 1
                j += 1
            
            if j == self.pattern_length:
                # Pattern found
                matches.append(i - j)
                j = self.failure_function[j - 1]
            elif i < text_length and text[i] != self.pattern[j]:
                # Mismatch occurred
                if j != 0:
                    j = self.failure_function[j - 1]
                else:
                    i += 1
        
        self.matches = matches
        return matches

class RabinKarpSearcher(StringMatcher):
    """Rabin-Karp string matching algorithm implementation using rolling hash"""
    
    def __init__(self, pattern: str):
        super().__init__(pattern.upper())
        self.base = 256  # Number of characters in alphabet
        self.prime = 101  # Prime number for hashing
        self.pattern_hash = self._hash(self.pattern)
    
    def _hash(self, string: str) -> int:
        """Calculate hash value for a string"""
        hash_value = 0
        for i, char in enumerate(string):
            hash_value = (hash_value + ord(char) * (self.base ** (len(string) - 1 - i))) % self.prime
        return hash_value
    
    def _rolling_hash(self, old_hash: int, old_char: str, new_char: str) -> int:
        """Calculate rolling hash for next window"""
        # Remove contribution of old character
        old_hash = (old_hash - ord(old_char) * (self.base ** (self.pattern_length - 1))) % self.prime
        
        # Shift left and add new character
        old_hash = (old_hash * self.base + ord(new_char)) % self.prime
        
        # Handle negative values
        if old_hash < 0:
            old_hash += self.prime
        
        return old_hash
    
    def search(self, text: str) -> List[int]:
        """Rabin-Karp search implementation"""
        text = text.upper()
        text_length = len(text)
        matches = []
        self.comparisons = 0
        
        if self.pattern_length > text_length:
            return matches
        
        # Calculate hash for first window of text
        text_hash = self._hash(text[:self.pattern_length])
        
        # Slide pattern over text one by one
        for i in range(text_length - self.pattern_length + 1):
            self.comparisons += 1
            
            # Check if hash values match
            if self.pattern_hash == text_hash:
                # Hash values match, verify character by character
                match = True
                for j in range(self.pattern_length):
                    self.comparisons += 1
                    if text[i + j] != self.pattern[j]:
                        match = False
                        break
                
                if match:
                    matches.append(i)
            
            # Calculate hash for next window (rolling hash)
            if i < text_length - self.pattern_length:
                text_hash = self._rolling_hash(text_hash, text[i], text[i + self.pattern_length])
        
        self.matches = matches
        return matches

class NaiveSearcher(StringMatcher):
    """Naive string matching algorithm for comparison"""
    
    def search(self, text: str) -> List[int]:
        """Naive search implementation"""
        text = text.upper()
        text_length = len(text)
        matches = []
        self.comparisons = 0
        
        if self.pattern_length > text_length:
            return matches
        
        for i in range(text_length - self.pattern_length + 1):
            match = True
            for j in range(self.pattern_length):
                self.comparisons += 1
                if text[i + j] != self.pattern[j]:
                    match = False
                    break
            
            if match:
                matches.append(i)
        
        self.matches = matches
        return matches

class StringMatchingFactory:
    """Factory class for creating string matching algorithm instances"""
    
    @staticmethod
    def create_matcher(algorithm: str, pattern: str) -> StringMatcher:
        """Create string matcher instance based on algorithm type"""
        algorithm = algorithm.lower()
        
        if algorithm == "boyer-moore":
            return BoyerMooreSearcher(pattern)
        elif algorithm == "kmp":
            return KMPSearcher(pattern)
        elif algorithm == "rabin-karp":
            return RabinKarpSearcher(pattern)
        elif algorithm == "naive":
            return NaiveSearcher(pattern)
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")

class PerformanceBenchmark:
    """Performance benchmark for string matching algorithms"""
    
    def __init__(self):
        self.results = {}
    
    def benchmark_algorithm(self, algorithm: str, pattern: str, text: str) -> Dict[str, any]:
        """Benchmark a specific algorithm"""
        matcher = StringMatchingFactory.create_matcher(algorithm, pattern)
        
        start_time = time.time()
        matches = matcher.search(text)
        end_time = time.time()
        
        execution_time = (end_time - start_time) * 1000  # Convert to milliseconds
        metrics = matcher.get_performance_metrics()
        
        result = {
            "algorithm": algorithm,
            "execution_time_ms": round(execution_time, 4),
            "matches_found": len(matches),
            "match_positions": matches,
            "comparisons": metrics["comparisons"],
            "pattern_length": metrics["pattern_length"],
            "text_length": len(text),
            "efficiency": round(len(matches) / metrics["comparisons"] * 1000, 4) if metrics["comparisons"] > 0 else 0
        }
        
        return result
    
    def compare_algorithms(self, pattern: str, text: str) -> Dict[str, any]:
        """Compare all string matching algorithms"""
        algorithms = ["naive", "kmp", "boyer-moore", "rabin-karp"]
        results = {}
        
        for algorithm in algorithms:
            try:
                results[algorithm] = self.benchmark_algorithm(algorithm, pattern, text)
            except Exception as e:
                results[algorithm] = {"error": str(e)}
        
        # Find best performing algorithm
        best_algorithm = min(
            [algo for algo in results if "error" not in results[algo]], 
            key=lambda x: results[x]["execution_time_ms"],
            default=None
        )
        
        return {
            "results": results,
            "best_algorithm": best_algorithm,
            "pattern": pattern,
            "text_length": len(text),
            "timestamp": time.time()
        }

# Usage example and testing
if __name__ == "__main__":
    # Example DNA sequence and pattern
    dna_sequence = """
    ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA
    ATCTTAGAGTGTCCCATCTGGTAAGTCAGGATACAGCTGTGAGCCAGATCCCTGACCCTG
    ATGGCACCAGATGTACTGCAGCTGCTCCCAAGCAGCTGGATGCTGCTGATGCAGCTGCT
    """.replace("\n", "").replace(" ", "")
    
    pattern = "ATGC"
    
    # Test all algorithms
    benchmark = PerformanceBenchmark()
    comparison_results = benchmark.compare_algorithms(pattern, dna_sequence)
    
    print("Algorithm Performance Comparison:")
    print("=" * 50)
    
    for algo, result in comparison_results["results"].items():
        if "error" not in result:
            print(f"\n{algo.upper()}:")
            print(f"  Execution Time: {result['execution_time_ms']:.4f} ms")
            print(f"  Matches Found: {result['matches_found']}")
            print(f"  Comparisons: {result['comparisons']}")
            print(f"  Efficiency: {result['efficiency']:.4f}")
        else:
            print(f"\n{algo.upper()}: ERROR - {result['error']}")
    
    print(f"\nBest Algorithm: {comparison_results['best_algorithm'].upper()}")