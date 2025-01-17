<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Font Awesome CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
</head>

<body class="bg-gray-100 min-h-screen flex flex-col">
    <!-- Preloader -->
    <div id="preloader" class="fixed inset-0 bg-white flex justify-center items-center z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col justify-center items-center min-h-screen">
        <div class="flex bg-white rounded-lg shadow-lg overflow-hidden w-11/12 md:w-3/4 lg:w-2/3">
            
            <!-- Logo Section -->
            <div class="hidden md:flex flex-col items-center justify-center bg-white-500 text-black w-1/2 p-8">
                <h1 class="text-4xl font-bold mb-4">Create an Account</h1>
                <p class="text-sm text-center">
                    Sign up to access more features and benefits.
                </p>
                <img src="{{ asset('assets/gambar.jpg') }}" alt="Logo" class="mt-6 max-w-full rounded-lg">
            </div>

            <!-- Form Section -->
            <div class="w-full md:w-1/2 p-6">
                <h2 class="text-2xl font-bold text-center mb-6">Sign Up</h2>
                

                <!-- Register Form -->
                <form id="register-form" action="{{ route('register') }}" method="POST">
                    @csrf
                    <div class="mb-4 relative">
                        <label for="name" class="block text-gray-700">Full Name</label>
                        <div class="relative">
                            <input type="text" id="name" name="name" placeholder="Enter your full name"
                                class="w-full p-2 border border-gray-300 rounded mt-2 pl-10 focus:ring focus:ring-blue-200"
                                required>
                            <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                        @error('name')
                            <span style="color: red; font-size: 0.875rem;">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-4 relative">
                        <label for="email" class="block text-gray-700">Email</label>
                        <div class="relative">
                            <input type="email" id="email" name="email" placeholder="Enter your email"
                                class="w-full p-2 border border-gray-300 rounded mt-2 pl-10 focus:ring focus:ring-blue-200"
                                required>
                            <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                        @error('email')
                            <span style="color: red; font-size: 0.875rem;">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-4 relative">
                        <label for="password" class="block text-gray-700">Password</label>
                        <div class="relative">
                            <input type="password" id="password" name="password" placeholder="Enter your password"
                                class="w-full p-2 border border-gray-300 rounded mt-2 pl-10 focus:ring focus:ring-blue-200"
                                required>
                            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                        @error('password')
                            <span style="color: red; font-size: 0.875rem;">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-4 relative">
                        <label for="password_confirmation" class="block text-gray-700">Confirm Password</label>
                        <div class="relative">
                            <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Confirm your password"
                                class="w-full p-2 border border-gray-300 rounded mt-2 pl-10 focus:ring focus:ring-blue-200"
                                required>
                            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                        @error('password_confirmation')
                            <span style="color: red; font-size: 0.875rem;">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-4 flex items-center justify-between">
                        <a href="{{ route('login') }}" class="text-blue-500 text-sm">Already have an account? Sign In</a>
                    </div>

                    <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Preloader script
        window.addEventListener('load', () => {
            document.getElementById('preloader').style.display = 'none';
        });
    </script>
</body>

</html>
