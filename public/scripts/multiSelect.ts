


let directoryInputCount = 1;

export function addDirectoryInput() {
    directoryInputCount++;
    const newInputDiv = document.createElement('div');
    newInputDiv.innerHTML = `<input type="file" id="directory-input-${directoryInputCount}" webkitdirectory directory multiple>`;
    document.getElementById('upload-form')?.insertBefore(newInputDiv, document.getElementById('upload-form')?.lastElementChild!);
}

export async function handleFormSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData();

    for (let i = 1; i <= directoryInputCount; i++) {
        const files = (document.getElementById(`directory-input-${i}`) as HTMLInputElement)?.files;

        if (files) {
            for (const file of files) {
                formData.append('files', file, (file as any).webkitRelativePath);
            }
        }
    }

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    console.log(result);
}