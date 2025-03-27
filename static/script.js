function baixarZip() {
    // Mostrar o carregamento e desabilitar o botão
    document.getElementById("loading").style.display = "block";
    document.getElementById("downloadBtn").classList.add("disabled");

    // Fazer o download ao chamar o endpoint
    fetch("/baixar-e-compactar")
        .then(response => response.blob())
        .then(data => {
            // Criar o link para download do arquivo
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "arquivos.zip";  // Nome do arquivo ZIP
            document.body.appendChild(a);
            a.click();
            a.remove();

            // Esconder o carregamento e reabilitar o botão
            document.getElementById("loading").style.display = "none";
            document.getElementById("downloadBtn").classList.remove("disabled");
        })
        .catch(error => {
            // Caso ocorra um erro, esconder o carregamento e reabilitar o botão
            document.getElementById("loading").style.display = "none";
            document.getElementById("downloadBtn").classList.remove("disabled");
            alert("Ocorreu um erro. Tente novamente.");
        });
}
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Verificar preferência do sistema ou armazenamento local
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Aplicar tema inicial
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Alternar tema quando o botão é clicado
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Atualizar quando a preferência do sistema mudar
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.classList.toggle('dark', e.matches);
        }
    });
});