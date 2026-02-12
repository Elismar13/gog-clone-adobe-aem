package com.gogstore.core.servlets;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.adobe.cq.dam.cfm.FragmentTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import javax.servlet.Servlet;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component(
    service = Servlet.class,
    property = {
        "sling.servlet.paths=/bin/gogstore/orders",
        "sling.servlet.methods=POST"
    }
)
public class OrderFragmentServlet extends SlingAllMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(OrderFragmentServlet.class);
    private static final String ORDERS_CF_PATH = "/content/dam/gogstore/orders";
    private static final String ORDER_TEMPLATE_PATH = "/conf/gogstore/settings/dam/cfm/models/order";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) 
            throws IOException {
        
        try {
            // Parse request body
            JsonNode requestBody = objectMapper.readTree(request.getReader());
            
            // Validate required fields
            if (!validateOrderData(requestBody)) {
                sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, 
                    "Dados do pedido incompletos");
                return;
            }

            // Extract order data
            String userId = requestBody.get("userId").asText();
            JsonNode items = requestBody.get("items");
            double totalAmount = requestBody.get("totalAmount").asDouble();
            double discountAmount = requestBody.get("discountAmount").asDouble();
            double finalAmount = requestBody.get("finalAmount").asDouble();
            String paymentMethod = requestBody.get("paymentMethod").asText();

            // Create Content Fragment
            String orderNumber = generateOrderNumber();
            String orderId = createOrderContentFragment(request.getResourceResolver(), userId, 
                orderNumber, items, totalAmount, discountAmount, finalAmount, paymentMethod);

            // Send success response
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("success", true);
            responseData.put("orderId", orderId);
            responseData.put("orderNumber", orderNumber);
            responseData.put("message", "Pedido criado com sucesso como Content Fragment");

            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_CREATED);
            objectMapper.writeValue(response.getWriter(), responseData);

        } catch (Exception e) {
            LOG.error("Erro ao criar pedido como Content Fragment", e);
            sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Erro interno ao processar pedido");
        }
    }

    private boolean validateOrderData(JsonNode requestBody) {
        return requestBody != null &&
               requestBody.has("userId") &&
               requestBody.has("items") &&
               requestBody.has("totalAmount") &&
               requestBody.has("discountAmount") &&
               requestBody.has("finalAmount") &&
               requestBody.has("paymentMethod") &&
               requestBody.get("items").isArray() &&
               requestBody.get("items").size() > 0;
    }

    private String generateOrderNumber() {
        LocalDateTime now = LocalDateTime.now();
        String timestamp = now.format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "ORD-" + timestamp + "-" + uuid;
    }

    private String createOrderContentFragment(ResourceResolver resolver, String userId, String orderNumber,
                                             JsonNode items, double totalAmount, double discountAmount,
                                             double finalAmount, String paymentMethod) throws Exception {

        Session session = resolver.adaptTo(Session.class);
        String orderId = UUID.randomUUID().toString();
        String fragmentName = "order-" + orderId;
        String fragmentPath = ORDERS_CF_PATH + "/" + userId + "/" + fragmentName;

        try {
            // Get the FragmentTemplate using the correct path
            Resource templateResource = resolver.getResource(ORDER_TEMPLATE_PATH);
            if (templateResource == null) {
                throw new Exception("Template de pedido não encontrado: " + ORDER_TEMPLATE_PATH);
            }

            // Try to get FragmentTemplate from jcr:content first
            FragmentTemplate template = templateResource.adaptTo(FragmentTemplate.class);
            
            // If that fails, try direct adaptation
            if (template == null) {
                template = templateResource.getChild("jcr:content").adaptTo(FragmentTemplate.class);
            }
            
            if (template == null) {
                throw new Exception("FragmentTemplate não encontrado para: " + ORDER_TEMPLATE_PATH);
            }
            
            LOG.info("FragmentTemplate encontrado: " + template.getTitle());

            // Create content fragment
            String parentPath = fragmentPath.substring(0, fragmentPath.lastIndexOf('/'));
            Resource parentResource = resolver.getResource(parentPath);
            
            // Create parent directories if they don't exist
            if (parentResource == null) {
                LOG.info("Creating parent directory structure: " + parentPath);
                ensureNodeExists(session, parentPath, "sling:Folder");
                parentResource = resolver.getResource(parentPath);
            }
            
            if (parentResource == null) {
                throw new Exception("Não foi possível criar diretório pai: " + parentPath);
            }
            
            String fragmentTitle = "Order " + orderNumber;
            ContentFragment orderFragment = template.createFragment(
                parentResource, 
                fragmentName,
                fragmentTitle
            );

            // Set fragment properties
            orderFragment.setTitle("Pedido #" + orderNumber);
            orderFragment.setDescription("Pedido do usuário: " + userId);

            // Set order data
            orderFragment.getElement("orderId").setContent(orderId, "text/plain");
            orderFragment.getElement("orderNumber").setContent(orderNumber, "text/plain");
            orderFragment.getElement("userId").setContent(userId, "text/plain");
            orderFragment.getElement("totalAmount").setContent(String.valueOf(totalAmount), "text/plain");
            orderFragment.getElement("discountAmount").setContent(String.valueOf(discountAmount), "text/plain");
            orderFragment.getElement("finalAmount").setContent(String.valueOf(finalAmount), "text/plain");
            orderFragment.getElement("paymentMethod").setContent(paymentMethod, "text/plain");
            orderFragment.getElement("status").setContent("completed", "text/plain");
            orderFragment.getElement("createdAt").setContent(LocalDateTime.now().toString(), "text/plain");

            // Create items as multivalued text
            StringBuilder itemsJson = new StringBuilder("[");
            for (int i = 0; i < items.size(); i++) {
                JsonNode item = items.get(i);
                if (i > 0) itemsJson.append(",");
                
                itemsJson.append("{")
                    .append("\"gameId\":\"").append(item.get("gameId").asText()).append("\",")
                    .append("\"title\":\"").append(item.get("title").asText()).append("\",")
                    .append("\"price\":").append(item.get("price").asDouble()).append(",")
                    .append("\"quantity\":").append(item.get("quantity").asInt());
                
                if (item.has("image") && !item.get("image").asText().isEmpty()) {
                    itemsJson.append(",\"image\":\"").append(item.get("image").asText()).append("\"");
                }
                
                itemsJson.append("}");
            }
            itemsJson.append("]");
            
            orderFragment.getElement("items").setContent(itemsJson.toString(), "application/json");

            // Save the fragment
            session.save();
            
            LOG.info("Content Fragment de pedido criado: path={}, orderNumber={}, userId={}", 
                fragmentPath, orderNumber, userId);

            return orderId;

        } catch (ContentFragmentException e) {
            LOG.error("Erro ao criar Content Fragment", e);
            throw new Exception("Erro ao criar Content Fragment: " + e.getMessage());
        }
    }

    private void ensureNodeExists(Session session, String path, String nodeType) throws Exception {
        if (!session.nodeExists(path)) {
            String parentPath = path.substring(0, path.lastIndexOf('/'));
            String nodeName = path.substring(path.lastIndexOf('/') + 1);
            
            // Create parent if needed
            if (!session.nodeExists(parentPath)) {
                ensureNodeExists(session, parentPath, "sling:Folder");
            }
            
            // Create the node
            session.getNode(parentPath).addNode(nodeName, nodeType);
            session.save();
            LOG.info("Created node: " + path + " (type: " + nodeType + ")");
        }
    }

    private void sendErrorResponse(SlingHttpServletResponse response, int statusCode, String message) 
            throws IOException {
        response.setContentType("application/json");
        response.setStatus(statusCode);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("error", message);
        
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
