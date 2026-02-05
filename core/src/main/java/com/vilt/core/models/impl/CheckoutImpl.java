package com.vilt.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.vilt.core.models.Checkout;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
        adaptables = SlingHttpServletRequest.class,
        adapters = {Checkout.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
        resourceType = CheckoutImpl.RESOURCE_TYPE
)
@Exporter(
        name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class CheckoutImpl implements Checkout, ComponentExporter {

    public static final String RESOURCE_TYPE = "gogstore/components/content/checkout";

    @ValueMapValue
    private String gotoPath;

    @ValueMapValue
    private Boolean showSummary;

    @Override
    public String getGotoPath() {
        return gotoPath;
    }

    @Override
    public Boolean getShowSummary() {
        return showSummary != null ? showSummary : Boolean.TRUE;
    }

    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
}
