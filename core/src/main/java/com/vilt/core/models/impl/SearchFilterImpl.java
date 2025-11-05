package com.vilt.core.models.impl;


import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.vilt.core.models.Gamelist;
import com.vilt.core.models.SearchFilter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
        adaptables = SlingHttpServletRequest.class,
        adapters = {Gamelist.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
        resourceType = SearchFilterImpl.RESOURCE_TYPE
)
@Exporter(
        name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class SearchFilterImpl implements SearchFilter, ComponentExporter {

    public static final String RESOURCE_TYPE = "gogstore/components/content/searchfilter";

    @ValueMapValue
    private String title;


    public String getTitle() {
        return title;
    }

    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
}
