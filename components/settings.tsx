"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Save,
  X,
  Clock,
  Dumbbell,
  Coffee,
  Repeat,
  Languages,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { languages } from "@/lib/languages";
interface SettingsProps {
  settings: {
    prepTime: number;
    workTime: number;
    restTime: number;
    rounds: number;
  };
  onUpdate: (settings: any) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export function Settings({ settings, onUpdate, onCancel, t }: SettingsProps) {
  const [formValues, setFormValues] = useState(settings);
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("timer");
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: Number.parseInt(value, 10) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(formValues);
  };

  const handleDoneLanguage = () => {
    if (selectedLanguage !== language) {
      setLanguage(selectedLanguage);
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
            {t("settings")}
          </h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Tabs
          defaultValue="timer"
          className="mb-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="timer" className="text-base">
              <Clock className="w-4 h-4 mr-2" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {t("timerSettings")}
              </span>
            </TabsTrigger>
            <TabsTrigger value="language" className="text-base">
              <Languages className="w-4 h-4 mr-2" />
              {t("language")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                  <Label
                    htmlFor="prepTime"
                    className="text-base md:text-lg font-medium"
                  >
                    {t("prepTime")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues({
                        ...formValues,
                        prepTime: Math.max(1, formValues.prepTime - 5),
                      })
                    }
                    className="px-3 py-2 bg-gray-200 rounded-l-md text-sm h-12 flex items-center justify-center"
                  >
                    -5
                  </button>
                  <Input
                    id="prepTime"
                    name="prepTime"
                    type="number"
                    min="1"
                    value={formValues.prepTime}
                    onChange={handleChange}
                    className="text-base md:text-lg h-12 border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 rounded-none flex-1 text-center focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues({
                        ...formValues,
                        prepTime: formValues.prepTime + 5,
                      })
                    }
                    className="px-3 py-2 bg-gray-200 rounded-r-md text-sm h-12 flex items-center justify-center"
                  >
                    +5
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Dumbbell className="w-5 h-5 mr-2 text-green-500" />
                  <Label
                    htmlFor="workTime"
                    className="text-base md:text-lg font-medium"
                  >
                    {t("workTime")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues({
                        ...formValues,
                        workTime: Math.max(1, formValues.workTime - 5),
                      })
                    }
                    className="px-3 py-2 bg-gray-200 rounded-l-md text-sm h-12 flex items-center justify-center"
                  >
                    -5
                  </button>
                  <Input
                    id="workTime"
                    name="workTime"
                    type="number"
                    min="1"
                    value={formValues.workTime}
                    onChange={handleChange}
                    className="text-base md:text-lg h-12 border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 rounded-none flex-1 text-center outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues({
                        ...formValues,
                        workTime: formValues.workTime + 5,
                      })
                    }
                    className="px-3 py-2 bg-gray-200 rounded-r-md text-sm h-12 flex items-center justify-center"
                  >
                    +5
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Coffee className="w-5 h-5 mr-2 text-red-500" />
                  <Label
                    htmlFor="restTime"
                    className="text-base md:text-lg font-medium"
                  >
                    {t("restTime")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues({
                        ...formValues,
                        restTime: Math.max(1, formValues.restTime - 5),
                      })
                    }
                    className="px-3 py-2 bg-gray-200 rounded-l-md text-sm h-12 flex items-center justify-center"
                  >
                    -5
                  </button>
                  <Input
                    id="restTime"
                    name="restTime"
                    type="number"
                    min="1"
                    value={formValues.restTime}
                    onChange={handleChange}
                    className="text-base md:text-lg h-12 border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 rounded-none flex-1 text-center outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues({
                        ...formValues,
                        restTime: formValues.restTime + 5,
                      })
                    }
                    className="px-3 py-2 bg-gray-200 rounded-r-md text-sm h-12 flex items-center justify-center"
                  >
                    +5
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Repeat className="w-5 h-5 mr-2 text-blue-500" />
                  <Label
                    htmlFor="rounds"
                    className="text-base md:text-lg font-medium"
                  >
                    {t("numRounds")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues({
                        ...formValues,
                        rounds: Math.max(1, formValues.rounds - 1),
                      })
                    }
                    className="px-3 py-2 bg-gray-200 rounded-l-md text-sm h-12 flex items-center justify-center"
                  >
                    -1
                  </button>
                  <Input
                    id="rounds"
                    name="rounds"
                    type="number"
                    min="1"
                    value={formValues.rounds}
                    onChange={handleChange}
                    className="text-base md:text-lg h-12 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-none flex-1 text-center outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormValues({
                        ...formValues,
                        rounds: formValues.rounds + 1,
                      })
                    }
                    className="px-3 py-2 bg-gray-200 rounded-r-md text-sm h-12 flex items-center justify-center"
                  >
                    +1
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="h-12 px-6 text-base md:text-lg"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  className="h-12 px-6 text-base md:text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {t("save")}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="language" className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Languages className="w-5 h-5 mr-2 text-purple-500" />
                <Label
                  htmlFor="language"
                  className="text-base md:text-lg font-medium"
                >
                  {t("selectLanguage")}
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedLanguage === lang.code
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "language" && (
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  onClick={handleDoneLanguage}
                  className="h-12 px-6 text-base md:text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  {t("save")}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
