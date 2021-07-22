/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
const Queue = require('./Queue');

class BinarySearchTree {
  constructor(key = null, value = null, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  insert(key, value) {
    if (this.key == null) {
      this.key = key;
      this.value = value;
    } else if (key < this.key) {
      if (this.left == null) {
        this.left = new BinarySearchTree(key, value, this);
      } else {
        this.left.insert(key, value);
      }
    } else if (this.right == null) {
      this.right = new BinarySearchTree(key, value, this);
    } else {
      this.right.insert(key, value);
    }
  }

  find(key) {
    if (this.key == key) {
      return this.value;
    } if (key < this.key && this.left) {
      return this.left.find(key);
    } if (key > this.key && this.right) {
      return this.right.find(key);
    }
    throw new Error('Key Not Found');
  }

  remove(key) {
    if (this.key == key) {
      if (this.left && this.right) {
        const successor = this.right._findMin();
        this.key = successor.key;
        this.value = successor.value;
        successor.remove(successor.key);
      } else if (this.left) {
        this._replaceWith(this.left);
      } else if (this.right) {
        this._replaceWith(this.right);
      } else {
        this._replaceWith(null);
      }
    } else if (key < this.key && this.left) {
      this.left.remove(key);
    } else if (key > this.key && this.right) {
      this.right.remove(key);
    } else {
      throw new Error('Key Not Found');
    }
  }

  dfsInOrder(values = []) {
    if (this.left) {
      values = this.left.dfsInOrder(values);
    }
    values.push(this.value);
    if (this.right) {
      values = this.right.dfsInOrder(values);
    }
    return values;
  }

  dfsPreOrder(values = []) {
    values.push(this.value);
    if (this.left) {
      values = this.left.dfsPreOrder(values);
    }
    if (this.right) {
      values = this.right.dfsPreOrder(values);
    }
    return values;
  }

  dfsPostOrder(values = []) {
    if (this.left) {
      values = this.left.dfsPostOrder(values);
    }
    if (this.right) {
      values = this.right.dfsPostOrder(values);
    }
    values.push(this.value);
    return values;
  }

  bfs(tree, values = []) {
    const queue = new Queue();
    queue.enqueue(tree);
    let node = queue.dequeue();
    while (node) {
      values.push(node.value);

      if (node.left) {
        queue.enqueue(node.left);
      }

      if (node.right) {
        queue.enqueue(node.right);
      }
      node = queue.dequeue();
    }

    return values;
  }

  _replaceWith(node) {
    if (this.parent) {
      if (this == this.parent.left) {
        this.parent.left = node;
      } else if (this == this.parent.right) {
        this.parent.right = node;
      }

      if (node) {
        node.parent = this.parent;
      }
    } else if (node) {
      this.key = node.key;
      this.value = node.value;
      this.left = node.left;
      this.right = node.right;
    } else {
      this.key = null;
      this.value = null;
      this.left = null;
      this.right = null;
    }
  }

  _findMin() {
    if (!this.left) {
      return this;
    }
    return this.left._findMin();
  }

  getHeight(currentHeight = 0) {
    // base case: current node has no children
    if (!this.left && this.right) return currentHeight;

    // recursive case:

    // compute new height
    const newHeight = currentHeight + 1;

    // if no left child, recurse down the right subtree
    if (!this.left) {
      return this.right.getHeight(newHeight);
    }

    // if no right child, recurse down the left subtree
    if (!this.right) {
      return this.left.getHeight(newHeight);
    }

    // if node has both children, recurse down both
    const leftHeight = this.left.getHeight(newHeight);
    const rightHeight = this.right.getHeight(newHeight);

    // return greater of the left or right subtree values
    return Math.max(leftHeight, rightHeight);
  }

  isBST() {
    // Use the `dfsInOrder()` method to traverse the tree.
    const values = this.dfsInOrder();

    // Check if the array returned by `dfsInOrder()` is a sorted array.
    for (let i = 1; i < values.length; i++) {
      // Compare the current and previous values.
      if (values[i] < values[i - 1]) {
        return false;
      }
    }
    return true;

    /*
    To optimize space complexity you can:
    Instead of creating the auxiliary array, you can simply keep track of the previously visited
    node and compare it to the currently visited node while doing the in-order traversal. The space
    complexity becomes O(h), where h is the height of the tree, because the algorithm still needs
    to allocate space for the recursion stack.
    */
  }

  findKthLargestValue(k) {
    // Use the `dfsInOrder()` method to traverse the tree.
    const values = this.dfsInOrder();
    const kthIndex = values.length - k;

    // Ensure that the index is within the bounds of the array.
    if (kthIndex >= 0) {
      return values[kthIndex];
    }
    console.error('k value exceeds the size of the BST.');
  }
}
