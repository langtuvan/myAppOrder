export const getFilesFromEvent = async (event: any) => {

  const files = []

  if (event.type === 'drop' && event.dataTransfer.items.length > 0) {
    // Handle drag-and-drop events
    for (const item of event.dataTransfer.items) {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        files.push(file)
      }
    }
  } else if (event.type === 'change' && event.target) {
    // Handle input file selection
    for (const file of event.target.files) {  
      files.push(file)
    }
  }
  return files
}
