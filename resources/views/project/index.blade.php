<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Project</title>
    @vite('resources/css/app.css')
    <link href="https://cdn.jsdelivr.net/npm/phosphor-icons@1.4.2/src/css/icons.min.css" rel="stylesheet">
</head>

<body>
    <div class="my-6 mx-20">
        <h1 class="text-xl font-semibold">Proyek anda</h1>

        <div id="project-container" class="mt-6 grid grid-cols-4 gap-8 gap-y-4">
            <!-- <div class="project-card"></div> -->
            <div class="bg-white hover:bg-slate-300 hover:cursor-pointer text-lg border-2 border- border-slate-300 border-dashed rounded-lg p-3 h-24 flex items-center gap-2 place-content-center">
                <i class="ph-bold ph-plus"></i>
                <p class="w-fit">Tambah proyek</p>
            </div>
        </div>
    </div>

    <script src="project.js"></script>

</body>

</html>