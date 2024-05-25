


export async function handleFormSubmit(e: Event) {
    e.preventDefault();
  
    //
    const formData = new FormData();
  
    //
    const files = (document.getElementById('directory-input') as HTMLInputElement).files;
  
    //
    if(files) {
      for(const file of files) {
        formData.append('files', file, (file as any).webkitRelativePath)
      }
    }
  
    const response = await fetch("/upload", {
      method: 'POST',
      body: formData,
    });
  
    const results = await response.json();
  
    console.log("results", results);
    
    return results;
  
  }
  