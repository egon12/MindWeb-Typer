export default function(inputString) {

  const words = inputString.split('\n').filter(i => i.trim().length > 0)

  const tree = makeTree(words)

  return tree
}

function makeTree(words) {
  var level = 0;
  var root = { id: words[0], children: [] }
  var parent = root

  for (let i=1; i<words.length; i++) {
    const w = words[i].trim()
    const l = getLevel(words[i])

    const obj = { id: w, children: [] }
    
    if (l > level) {
      parent = findInTree(root, words[i-1].trim())
    } else if (l == level) {

    } else if (l < level) {
      parent = findInTreeLastObjectOnLevel(root, l - 1)
    }

    obj.parentId = parent.id
    parent.children.push(obj)
    level = l
  }

  return root
}

function findInTreeLastObjectOnLevel(tree, level) {
  if (level == 0) {
    return tree
  }

  const lastIndex = tree.children.length - 1

  if (level == 1) {
    return tree.children[lastIndex]
  }

  return findInTreeLastObjectOnLevel(tree.children[lastIndex], level - 1)
}


function getLevel(word) {
  return countSpaces(word) / 2
}

function countSpaces(word) {
  for (var i=0; i<word.length; i++) {
    if (word[i] != ' ') {
      return i;
    }
  }
}

function findInTree(tree, id) {

  if (tree.id == id) {
    return tree
  }

  for (let i=0; i<tree.children.length; i++) {
    const result = findInTree(tree.children[i], id)
    if (result != null) {
      return result
    }
  }

  return null
}
