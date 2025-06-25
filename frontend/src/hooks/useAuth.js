import { useSelector, useDispatch } from 'react-redux';
import { useRefreshTokenMutation } from '../features/auth/authApi';
import { logout } from '../features/auth/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, accessToken, refreshToken } = useSelector((state) => state.auth);
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const refreshAccessToken = async () => {
    try {
      const response = await refreshTokenMutation({ refreshToken }).unwrap();
      return response.accessToken;
    } catch (error) {
      dispatch(logout());
      return null;
    }
  };

  return {
    user,
    isAuthenticated,
    accessToken,
    refreshAccessToken,
    logout: () => dispatch(logout()),
  };
};

export default useAuth;