

export default function mindmapProcessor(inputString) {

  const words = inputString.split('\n').filter(i => i.trim().length > 0)

  const tree = makeTree(words)
  
  level1PosX = [-10, 10]
  makePosRecursive(tree, 0, tree)

  return makeTreeToFlat(tree)
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

function makeTreeToFlat(tree) {

  const { id, x, y, parentId, childs } = tree

  const link = parentId ? [parentId] : []

  var list = [{ id: id, name: id, x, y, color: 'steelblue', link }]

  for (let i=0; i<childs.length; i++) {
    list = list.concat(makeTreeToFlat(childs[i]))
  }

  return list
}


function makeTree(words) {
  var level = 0;
  var root = { id: words[0], childs: [] }
  var parent = root

  for (let i=1; i<words.length; i++) {
    const w = words[i].trim()
    const l = getLevel(words[i])

    const obj = { id: w, childs: [] }
    
    if (l > level) {
      parent = findInTree(root, words[i-1].trim())
    } else if (l == level) {

    } else if (l < level) {
      parent = findInTreeLastObjectOnLevel(root, l - 1)
    }

    obj.parentId = parent.id
    parent.childs.push(obj)
    level = l
  }

  return root
}

var level1PosX = [-1, 1]
function makePos(tree, level, root) {
  if (level == 0) {
    tree.x = 0;
    tree.y = 0;

    const ang = Math.PI * 2 / tree.childs.length
    for (let i=0; i<tree.childs.length; i++) {
      const x = Math.cos(ang * i) * 10
      const y = Math.sin(ang * i) * 10

      tree.childs[i].x = x > 0 ? Math.floor(x) : Math.ceil(x)
      tree.childs[i].y = y > 0 ? Math.floor(y) : Math.ceil(y)
    }

    return
  }

  if (level == 1) {
    // already set when set pos at level 0
    return
  }

  const parent = findInTree(root, tree.parentId)

  if (parent.x > 0) {
    tree.x = parent.x + 10
    tree.y = parent.y + parent.childs.indexOf(tree) - Math.floor(parent.childs.length / 2)
  } else {
    tree.x = parent.x - 10
    tree.y = parent.y + parent.childs.indexOf(tree) - Math.floor(parent.childs.length / 2)
  }
}

function makePosRecursive(tree, level, root) {
  makePos(tree, level, root)
  for (let i=0; i<tree.childs.length; i++) {
    makePosRecursive(tree.childs[i], level+1, tree)
  }
}

function findInTree(tree, id) {

  if (tree.id == id) {
    return tree
  }

  for (let i=0; i<tree.childs.length; i++) {
    const result = findInTree(tree.childs[i], id)
    if (result != null) {
      return result
    }
  }

  return null
}

function findInTreeLastObjectOnLevel(tree, level) {
  if (level == 0) {
    return tree
  }

  const lastIndex = tree.childs.length - 1

  if (level == 1) {
    return tree.childs[lastIndex]
  }

  return findInTreeLastObjectOnLevel(tree.childs[lastIndex], level - 1)
}
