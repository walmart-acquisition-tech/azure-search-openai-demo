import { useTranslation } from "react-i18next";
import { AIMode } from "../../api";
import styles from "./AIModeToggle.module.css";

interface Props {
    currentAIMode: AIMode;
    updateAIMode: (aiMode: AIMode) => void;
}

export const AIModeToggle = ({ currentAIMode, updateAIMode }: Props) => {
    const { t } = useTranslation();

    const handleModeChange = (selectedMode: AIMode) => {
        updateAIMode(selectedMode);
    };

    const getModePosition = (mode: AIMode): string => {
        switch (mode) {
            case AIMode.DataOnly:
                return "0%";
            case AIMode.OpenAIOnly:
                return "33.33%";
            case AIMode.DataAndOpenAI:
                return "66.67%";
            default:
                return "66.67%";
        }
    };

    return (
        <div className={styles.aiModeToggle}>
            <div className={styles.optionSlider}>
                <div className={styles.sliderTrack}>
                    <div className={styles.sliderThumb} style={{ left: getModePosition(currentAIMode) }}>
                        {currentAIMode === AIMode.DataOnly && t("labels.aiMode.options.dataOnly")}
                        {currentAIMode === AIMode.OpenAIOnly && t("labels.aiMode.options.openaiOnly")}
                        {currentAIMode === AIMode.DataAndOpenAI && t("labels.aiMode.options.dataAndOpenai")}
                    </div>

                    <div className={styles.sliderOptions}>
                        <div
                            className={`${styles.sliderOption} ${currentAIMode === AIMode.DataOnly ? styles.active : ""}`}
                            onClick={() => handleModeChange(AIMode.DataOnly)}
                        >
                            {t("labels.aiMode.options.dataOnly")}
                        </div>
                        <div
                            className={`${styles.sliderOption} ${currentAIMode === AIMode.OpenAIOnly ? styles.active : ""}`}
                            onClick={() => handleModeChange(AIMode.OpenAIOnly)}
                        >
                            {t("labels.aiMode.options.openaiOnly")}
                        </div>
                        <div
                            className={`${styles.sliderOption} ${currentAIMode === AIMode.DataAndOpenAI ? styles.active : ""}`}
                            onClick={() => handleModeChange(AIMode.DataAndOpenAI)}
                        >
                            {t("labels.aiMode.options.dataAndOpenai")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
