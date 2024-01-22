
export function getObjectsToDelete(movedFiles, jobNumber) {
    let filesToDelete = []
    let jobFolderPath = ""
    let temp = movedFiles[0].Key.split("/").reverse()
    temp = temp.splice(temp.indexOf(jobNumber))
    jobFolderPath = temp.reverse().join("/")

    movedFiles.forEach(f => {
      let tempKeys = f.Key.split("/")
      let acc = ""
      for (let i = temp.length; i < tempKeys.length; i++) {
        acc += "/" + tempKeys.slice(i, i + 1)
        if (!filesToDelete.includes(acc)) filesToDelete.push(`${acc}`)
      }
    })
    filesToDelete = filesToDelete.map(f => `${jobFolderPath}${f}`)
      .sort((a, b) => b.split("/").length - a.split("/").length)
    filesToDelete.push(jobFolderPath + "/")    
    return filesToDelete
}

