package com.vilt.core.models;

import org.osgi.annotation.versioning.ConsumerType;
import com.adobe.cq.dam.cfm.ContentFragment;
import java.util.Optional;

@ConsumerType
public interface Highlight {

    /**
     * Retorna o caminho para o Fragmento de Conteúdo (CF) salvo na dialog.
     * @return O caminho do CF (ex: /content/dam/gogstore/highlights/meu-destaque).
     */
    String getTitle();

    String getExternalLink();

    String getHighlightPath();
}