import { useState } from "react";
import { Stack } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { useTranslation } from "react-i18next";

import styles from "./AIModeSettings.module.css";
import { HelpCallout } from "../../components/HelpCallout";
import { AIMode } from "../../api";

interface Props {
    defaultAIMode: AIMode;
    updateAIMode: (aiMode: AIMode) => void;
}

export const AIModeSettings = ({ defaultAIMode, updateAIMode }: Props) => {
    const [aiMode, setAIMode] = useState<AIMode>(defaultAIMode || AIMode.DataAndOpenAI);
    const { t } = useTranslation();

    const aiModeId = useId("aiMode");
    const aiModeFieldId = useId("aiModeField");

    const handleModeChange = (selectedMode: AIMode) => {
        setAIMode(selectedMode);
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
        <Stack className={styles.container} tokens={{ childrenGap: 10 }}>
            <HelpCallout labelId={aiModeId} fieldId={aiModeFieldId} helpText={t("helpTexts.aiMode")} label={t("labels.aiMode.label")} />

            <div className={styles.optionSlider}>
                <div className={styles.sliderTrack}>
                    <div className={styles.sliderThumb} style={{ left: getModePosition(aiMode) }}>
                        {aiMode === AIMode.DataOnly && t("labels.aiMode.options.dataOnly")}
                        {aiMode === AIMode.OpenAIOnly && t("labels.aiMode.options.openaiOnly")}
                        {aiMode === AIMode.DataAndOpenAI && t("labels.aiMode.options.dataAndOpenai")}
                    </div>

                    <div className={styles.sliderOptions}>
                        <div
                            className={`${styles.sliderOption} ${aiMode === AIMode.DataOnly ? styles.active : ""}`}
                            onClick={() => handleModeChange(AIMode.DataOnly)}
                        >
                            {t("labels.aiMode.options.dataOnly")}
                        </div>
                        <div
                            className={`${styles.sliderOption} ${aiMode === AIMode.OpenAIOnly ? styles.active : ""}`}
                            onClick={() => handleModeChange(AIMode.OpenAIOnly)}
                        >
                            {t("labels.aiMode.options.openaiOnly")}
                        </div>
                        <div
                            className={`${styles.sliderOption} ${aiMode === AIMode.DataAndOpenAI ? styles.active : ""}`}
                            onClick={() => handleModeChange(AIMode.DataAndOpenAI)}
                        >
                            {t("labels.aiMode.options.dataAndOpenai")}
                        </div>
                    </div>
                </div>
            </div>
        </Stack>
    );
};
