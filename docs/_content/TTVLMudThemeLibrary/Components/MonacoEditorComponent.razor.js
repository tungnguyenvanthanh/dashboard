let editors = {};

export async function initializeMonaco(divId, value, language, theme, dotNetHelper) {
    if (typeof require === 'undefined') {
        console.error('⚠️ Monaco loader.js chưa được tải trước khi gọi initializeMonaco.');
        return;
    }

    // 👉 Cấu hình require để load từ CDN
    require.config({
        paths: {
            vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs'
        }
    });

    // 👉 Không cần tự cấu hình getWorkerUrl nữa, Monaco từ CDN sẽ tự resolve đúng
    self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/'
    };

    require(['vs/editor/editor.main'], function () {
        const editor = monaco.editor.create(document.getElementById(divId), {
            value: value,
            language: language,
            theme: theme,
            automaticLayout: true
        });

        editor.onDidChangeModelContent(() => {
            const content = editor.getValue();
            dotNetHelper.invokeMethodAsync('OnContentChanged', content);
        });

        editors[divId] = editor;
    });
}

export function disposeMonaco(divId) {
    if (editors[divId]) {
        editors[divId].dispose();
        delete editors[divId];
    }
}
