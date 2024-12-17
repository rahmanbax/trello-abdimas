document.addEventListener('DOMContentLoaded', function() {
    const apiEndpoint = 'http://127.0.0.1:8000/api/projects';
  
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Referensi ke elemen kontainer di halaman
          const projectContainer = document.getElementById('project-container');
  
          // Loop melalui data proyek yang diterima
          data.forEach(project => {
            // Membuat elemen div untuk card proyek
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
  
            // Membuat elemen p untuk nama proyek
            const projectLink = document.createElement('a');
            projectLink.href = `/project/${project.idproject}`;

            // Membuat elemen p untuk nama proyek
            const projectName = document.createElement('p');
            projectName.textContent = project.nama_project; // Menampilkan nama proyek dari API
  
            // Menambahkan nama proyek ke dalam card
            projectCard.appendChild(projectName);
            
            // Membungkus seluruh card dengan link
            projectLink.appendChild(projectCard);

            // Menambahkan card ke dalam kontainer proyek
            projectContainer.appendChild(projectLink);
          });
        } else {
          console.log('Data tidak valid atau kosong');
        }
      })
      .catch(error => {
        console.error('Terjadi kesalahan saat mengambil data:', error);
      });
});
