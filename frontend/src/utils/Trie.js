class TrieNode {
        constructor() {
          this.children = {};
          this.isEndOfWord = false;
        }
      }
      
      class Trie {
        constructor() {
          this.root = new TrieNode();
        }
      
        // Insert a word into the Trie
        insert(word) {
          let node = this.root;
          for (const char of word.toLowerCase()) {
            if (!node.children[char]) {
              node.children[char] = new TrieNode();
            }
            node = node.children[char];
          }
          node.isEndOfWord = true;
        }
      
        // Search for all words with a given prefix
        search(prefix) {
          let node = this.root;
          for (const char of prefix.toLowerCase()) {
            if (!node.children[char]) {
              return []; // No matches
            }
            node = node.children[char];
          }
          return this._getAllWordsFromNode(node, prefix);
        }
      
        // Helper function to collect all words from a given Trie node
        _getAllWordsFromNode(node, prefix) {
          const words = [];
          if (node.isEndOfWord) {
            words.push(prefix);
          }
          for (const char in node.children) {
            words.push(...this._getAllWordsFromNode(node.children[char], prefix + char));
          }
          return words;
        }
      }
      
      export default Trie;