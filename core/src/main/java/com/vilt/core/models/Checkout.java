package com.vilt.core.models;

import com.adobe.cq.export.json.ComponentExporter;

public interface Checkout extends ComponentExporter {
    String getGotoPath();
    Boolean getShowSummary();
}
