import React, { useState, useEffect } from "react";
import "./App.css";
import { TextField, Button } from "@mui/material";

const App = () => {
    const [iterations, setIterations] = useState([]);
    const [mode, setMode] = useState("Real-time");
    const [instantMode, setInstantMode] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [iterationsCount, setIterationsCount] = useState(10);
    const [timeInterval, setTimeInterval] = useState(1000);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        if (!generating) {
            clearInterval(intervalId);
        }
    }, [generating, intervalId]);

    const handleGenerate = (count, time) => {
        if (generating) return;

        setGenerating(true);
        const generated = [];

        if (instantMode) {
            for (let i = 0; i < count; i++) {
                generated.unshift(Math.round(Math.random()));
            }
            setIterations(generated);
            setGenerating(false);
        } else {
            const id = setInterval(() => {
                if (generated.length < count) {
                    const randomValue = Math.round(Math.random());
                    generated.unshift(randomValue);
                    setIterations([...generated]);
                } else {
                    clearInterval(id);
                    setGenerating(false);
                }
            }, time);
            setIntervalId(id);
        }

        setMode(instantMode ? "Instant" : "Real-time");
    };

    const handleStop = () => {
        if (generating) {
            clearInterval(intervalId);
            setGenerating(false);
            setMode("Real-time");
        }
    };

    const handleReset = () => {
        setGenerating(false);
        setIterations([]);
        setMode("Real-time");
    };

    return (
        <div className="center">
            <h1>Бинарный генератоп</h1>
            {/* <h1>
                Адресат: функция JS Random на ноутбуке Ялынского Алексея
                Сергеевича
            </h1> */}
            {/* <div style={{ height: 300, fontSize: 300, color: "red" }}>0</div> */}
            <GenerateComponent
                iterationsCount={iterationsCount}
                setIterationsCount={setIterationsCount}
                timeInterval={timeInterval}
                setTimeInterval={setTimeInterval}
                handleGenerate={handleGenerate}
                generating={generating}
                instantMode={instantMode}
                setInstantMode={setInstantMode}
            />

            {generating ? (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleStop}
                    className="btn-stop"
                >
                    Остановить
                </Button>
            ) : (
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleReset}
                    className="btn-reset"
                >
                    Сбросить
                </Button>
            )}

            <div className="stats">
                <StatsComponent iterations={iterations} />
            </div>
            <DisplayComponent iterations={iterations} />
        </div>
    );
};

const StatsComponent = ({ iterations }) => {
    const totalCount = iterations.length;
    const zeroCount = iterations.filter((item) => item === 0).length;
    const oneCount = totalCount - zeroCount;
    const zeroPercentage =
        totalCount === 0 ? 0 : (zeroCount / totalCount) * 100;

    return (
        <div>
            <h2>Статистика</h2>
            <p>Итерация № {totalCount}</p>
            <p>
                Нули: {zeroCount} ({zeroPercentage.toFixed(2)}%)
            </p>
            <p>
                Единицы: {oneCount} ({(100 - zeroPercentage).toFixed(2)}%)
            </p>
            <div className="rectangle-container">
                <div
                    className={`rectangle red`}
                    style={{ width: `${zeroPercentage}%` }}
                >
                    {zeroPercentage.toFixed(2)}%
                </div>
                <div
                    className={`rectangle green`}
                    style={{ width: `${100 - zeroPercentage}%` }}
                >
                    {(100 - zeroPercentage).toFixed(2)}%
                </div>
            </div>
        </div>
    );
};

const GenerateComponent = ({
    iterationsCount,
    setIterationsCount,
    timeInterval,
    setTimeInterval,
    handleGenerate,
    generating,
    instantMode,
    setInstantMode,
}) => {
    return (
        <div className="options">
            <div className="input-container">
                <TextField
                    label="Количество"
                    type="number"
                    value={iterationsCount}
                    onChange={(e) =>
                        setIterationsCount(parseInt(e.target.value))
                    }
                />
            </div>
            <div className="input-container">
                <TextField
                    label="Время (ms)"
                    type="number"
                    value={timeInterval}
                    onChange={(e) => setTimeInterval(parseInt(e.target.value))}
                />
            </div>
            <div className="checkbox-container">
                <label>
                    Сгенерировать сразу
                    <input
                        type="checkbox"
                        checked={instantMode}
                        onChange={() => setInstantMode(!instantMode)}
                    />
                </label>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleGenerate(iterationsCount, timeInterval)}
                disabled={generating}
            >
                {generating ? "Генерация..." : "Сгенерировать"}
            </Button>
        </div>
    );
};

const DisplayComponent = ({ iterations }) => {
    return (
        <div className="display-container">
            {iterations.length > 0 && (
                <div>
                    <h2>Таблица результатов</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>№ итерации</th>
                                <th>Число</th>
                            </tr>
                        </thead>
                        <tbody>
                            {iterations.map((iteration, index) => (
                                <tr
                                    key={index}
                                    className={`${
                                        iteration === 0 ? "red" : "green"
                                    }`}
                                >
                                    <td>{iterations.length - index}</td>
                                    <td>{iteration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default App;
