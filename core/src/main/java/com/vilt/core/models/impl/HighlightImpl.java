package com.vilt.core.models.impl;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.xfa.ModelFactory;
import com.vilt.core.models.Highlight;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Inject;

@Model(
        adaptables = SlingHttpServletRequest.class,
        adapters = {Highlight.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
        resourceType = HighlightImpl.RESOURCE_TYPE
)
@Exporter(
        name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class HighlightImpl implements Highlight {

    public static final String RESOURCE_TYPE = "gogstore/components/content/highlight";

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String externalLink;

    @ValueMapValue
    private String highlightPath;

    @Override
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getExternalLink() {
        return externalLink;
    }

    public void setExternalLink(String externalLink) {
        this.externalLink = externalLink;
    }

    public String getHighlightPath() {
        return highlightPath;
    }

    public void setHighlightPath(String highlightPath) {
        this.highlightPath = highlightPath;
    }
}

