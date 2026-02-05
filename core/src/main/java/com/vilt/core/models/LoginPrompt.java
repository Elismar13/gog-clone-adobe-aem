package com.vilt.core.models;

import com.adobe.cq.export.json.ComponentExporter;

public interface LoginPrompt extends ComponentExporter {
    String getGotoPath();
    Boolean getShowLogout();
}
