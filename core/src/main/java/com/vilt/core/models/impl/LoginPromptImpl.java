package com.vilt.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.vilt.core.models.LoginPrompt;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
        adaptables = SlingHttpServletRequest.class,
        adapters = {LoginPrompt.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
        resourceType = LoginPromptImpl.RESOURCE_TYPE
)
@Exporter(
        name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class LoginPromptImpl implements LoginPrompt, ComponentExporter {

    public static final String RESOURCE_TYPE = "gogstore/components/content/loginprompt";

    @ValueMapValue
    private String gotoPath;

    @ValueMapValue
    private Boolean showLogout;

    @Override
    public String getGotoPath() {
        return gotoPath;
    }

    @Override
    public Boolean getShowLogout() {
        return showLogout != null ? showLogout : Boolean.TRUE;
    }

    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
}
