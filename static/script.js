function baixarZip() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("downloadBtn").classList.add("disabled");
    fetch("/baixar-e-compactar")
        .then(response => response.blob())
        .then(data => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "arquivos.zip";  // Nome do arquivo ZIP
            document.body.appendChild(a);
            a.click();
            a.remove();
            document.getElementById("loading").style.display = "none";
            document.getElementById("downloadBtn").classList.remove("disabled");
        })
        .catch(error => {
            document.getElementById("loading").style.display = "none";
            document.getElementById("downloadBtn").classList.remove("disabled");
            alert("Ocorreu um erro. Tente novamente.");
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.classList.toggle('dark', e.matches);
        }
    });
});

function extrairPdf() {
    document.getElementById("second-loading").style.display = "block";
    document.getElementById("executeBtn").classList.add("disabled");
    fetch("/processar-pdf")
        .then(response => response.blob())
        .then(data => {
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "dados_extraidos.zip";
            document.body.appendChild(a);
            a.click();
            a.remove();
            document.getElementById("second-loading").style.display = "none";
            document.getElementById("executeBtn").classList.remove("disabled");
        })
        .catch(error => {
            document.getElementById("second-loading").style.display = "none";
            document.getElementById("executeBtn").classList.remove("disabled");
            alert("Ocorreu um erro. Tente novamente.");
        });
}