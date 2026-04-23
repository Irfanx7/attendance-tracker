import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          teacher_login: path.resolve(__dirname, 'teacher_login.html'),
          student_login: path.resolve(__dirname, 'student_login.html'),
          teacher_dashboard: path.resolve(__dirname, 'teacher_dashboard.html'),
          add_student: path.resolve(__dirname, 'add_student.html'),
          students: path.resolve(__dirname, 'students.html'),
          attendance: path.resolve(__dirname, 'attendance.html'),
          reports: path.resolve(__dirname, 'reports.html'),
          student_dashboard: path.resolve(__dirname, 'student_dashboard.html'),
          student_attendance: path.resolve(__dirname, 'student_attendance.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
