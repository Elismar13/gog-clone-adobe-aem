package com.vilt.core.models.impl;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import com.adobe.cq.export.json.ExporterConstants;
import com.vilt.core.models.GameData;
import com.vilt.core.models.Highlight;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;

@Model(
        adaptables = SlingHttpServletRequest.class,
        adapters = {GameData.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
        resourceType = GameDataImpl.RESOURCE_TYPE
)
@Exporter(
        name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
        extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class GameDataImpl implements GameData {

    public static final String RESOURCE_TYPE = "gogstore/components/content/gamedetail";

    private String title;

    // Injeta o objeto de requisição atual
    @Self
    private SlingHttpServletRequest request;

    // Campo para armazenar o valor do query parameter
    @RequestAttribute
    private String gameTitle;

    @Override
    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @PostConstruct
    protected void init() {
        this.setTitle(gameTitle != null ?
                gameTitle
                : "undefined");
    }
}
