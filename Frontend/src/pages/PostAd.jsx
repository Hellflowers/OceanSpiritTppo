import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./PostAd.css";

function PostAd({ user, setUser }) {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");

    if (!user) {
        navigate("/login");
        return null;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Проверяем формат файла
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const fileType = file.type;

        if (!allowedTypes.includes(fileType)) {
            setError("Допустимы только форматы: PNG, JPEG, JPG");
            setPreview("");
            setImage("");
            e.target.value = ""; // Очищаем input file
            return;
        }

        // Проверяем размер файла (не более 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB в байтах
        if (file.size > maxSize) {
            setError("Размер файла не должен превышать 5MB");
            setPreview("");
            setImage("");
            e.target.value = "";
            return;
        }

        setError(""); // Очищаем ошибку если все ок

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result); // base64
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (error) {
            alert("Пожалуйста, исправьте ошибку перед отправкой");
            return;
        }

        const ads = JSON.parse(localStorage.getItem("ads")) || [];
        const newAd = {
            id: Date.now(),
            title,
            description,
            price,
            image,
            seller: user.login,
        };

        ads.push(newAd);
        localStorage.setItem("ads", JSON.stringify(ads));
        navigate("/my-ads");
    };

    return (
        <>
            <Header user={user} setUser={setUser} />
            <div className="post-container">
                <h2>Разместить объявление</h2>

                {error && (
                    <div style={{
                        backgroundColor: "#ffe6e6",
                        color: "#d63031",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        border: "1px solid #ffcccc"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="post-form">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название"
                        required
                    />

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание"
                        required
                    />

                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Цена"
                        required
                    />

                    <div className="image-upload">
                        {preview && <img src={preview} alt="Превью" className="image-preview" />}
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                            onChange={handleImageChange}
                        />
                        <small style={{ color: "#666", fontSize: "12px" }}>
                            Допустимые форматы: PNG, JPG, JPEG. Максимальный размер: 5MB
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="post-save"
                        disabled={!!error} // Блокируем кнопку если есть ошибка
                        style={error ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                    >
                        Разместить
                    </button>
                </form>
            </div>
        </>
    );
}

export default PostAd;