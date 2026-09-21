import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const { setSession } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
      navigate('/');
    },
  });
};

export const useRegister = () => {
  const { setSession } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setSession(data.user, data.accessToken);
      navigate('/');
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  return () => {
    authService.logout().finally(() => {
      logout();
      navigate('/login');
    });
  };
};