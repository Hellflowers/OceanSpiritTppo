import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Auth.css";

function Auth({ setUser }) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Сбрасываем ошибку

        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (isRegister) {
            // Проверка длины пароля при регистрации
            if (password.length < 8) {
                setError("Пароль должен содержать не менее 8 символов");
                return;
            }

            const exists = users.find(u => u.login === login);
            if (exists) {
                setError("Пользователь уже существует");
                return;
            }

            users.push({ login, password });
            localStorage.setItem("users", JSON.stringify(users));

            const user = { login };
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            navigate("/");
        } else {
            const user = users.find(
                u => u.login === login && u.password === password
            );

            if (!user) {
                setError("Неверный логин или пароль");
                return;
            }

            const currentUser = { login };
            localStorage.setItem("user", JSON.stringify(currentUser));
            setUser(currentUser);
            navigate("/");
        }
    };

    // Проверяем, нужно ли показывать подсказку о длине пароля
    const showPasswordHint = isRegister && password.length > 0 && password.length < 8;

    return (
        <>
            <Header user={JSON.parse(localStorage.getItem("user"))} setUser={setUser} />
            <div className="auth">
                <h2>{isRegister ? "Регистрация" : "Вход"}</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => {
                            setLogin(e.target.value);
                            setError("");
                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder={isRegister ? "Пароль (мин. 8 символов)" : "Пароль"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        required
                    />
                    {showPasswordHint && (
                        <div className="password-hint">
                            Пароль должен содержать не менее 8 символов
                        </div>
                    )}
                    <button type="submit">
                        {isRegister ? "Зарегистрироваться" : "Войти"}
                    </button>
                </form>

                <p className="switch">
                    {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}
                    <span onClick={() => {
                        setIsRegister(!isRegister);
                        setError("");
                    }}>
            {isRegister ? " Войти" : " Зарегистрироваться"}
          </span>
                </p>
            </div>
        </>
    );
}

export default Auth;