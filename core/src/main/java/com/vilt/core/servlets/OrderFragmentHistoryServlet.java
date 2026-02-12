package com.gogstore.core.servlets;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.query.Query;
import javax.servlet.Servlet;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Component(
    service = Servlet.class,
    property = {
        "sling.servlet.paths=/bin/gogstore/orders-cf",
        "sling.servlet.methods=GET"
    }
)
public class OrderFragmentHistoryServlet extends SlingSafeMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(OrderFragmentHistoryServlet.class);
    private static final String ORDERS_CF_PATH = "/content/dam/gogstore/orders";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) 
            throws IOException {
        
        try {
            // Get query parameters
            String userId = request.getParameter("userId");
            String pageStr = request.getParameter("page");
            String limitStr = request.getParameter("limit");
            String startDate = request.getParameter("startDate");
            String endDate = request.getParameter("endDate");

            // Validate required parameters
            if (userId == null || userId.trim().isEmpty()) {
                sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, 
                    "Parâmetro userId é obrigatório");
                return;
            }

            int page = parseInt(pageStr, 1);
            int limit = parseInt(limitStr, 10);
            int offset = (page - 1) * limit;

            // Get orders from Content Fragments
            List<Map<String, Object>> orders = getOrderFragments(request.getResourceResolver(), 
                userId, offset, limit, startDate, endDate);

            // Get total count for pagination
            int totalCount = getTotalOrderFragments(request.getResourceResolver(), userId, startDate, endDate);
            int totalPages = (int) Math.ceil((double) totalCount / limit);

            // Build response
            ObjectNode responseNode = objectMapper.createObjectNode();
            responseNode.put("success", true);
            responseNode.put("page", page);
            responseNode.put("limit", limit);
            responseNode.put("total", totalCount);
            responseNode.put("totalPages", totalPages);
            
            ArrayNode ordersArray = responseNode.putArray("orders");
            for (Map<String, Object> order : orders) {
                ordersArray.addPOJO(order);
            }

            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_OK);
            objectMapper.writeValue(response.getWriter(), responseNode);

        } catch (Exception e) {
            LOG.error("Erro ao buscar histórico de pedidos (Content Fragments)", e);
            sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
                "Erro interno ao buscar pedidos");
        }
    }

    private List<Map<String, Object>> getOrderFragments(ResourceResolver resolver, String userId,
                                                       int offset, int limit, String startDate, String endDate) {
        
        List<Map<String, Object>> orders = new ArrayList<>();
        String userOrdersPath = ORDERS_CF_PATH + "/" + userId;

        Resource userOrdersResource = resolver.getResource(userOrdersPath);
        if (userOrdersResource == null) {
            return orders;
        }

        // Get all order fragments
        List<ContentFragment> fragments = StreamSupport.stream(userOrdersResource.getChildren().spliterator(), false)
            .map(resource -> resource.adaptTo(ContentFragment.class))
            .filter(Objects::nonNull)
            .filter(cf -> passesDateFilter(cf, startDate, endDate))
            .sorted((a, b) -> {
                try {
                    String dateA = a.getElement("createdAt").getContent();
                    String dateB = b.getElement("createdAt").getContent();
                    return dateB.compareTo(dateA); // Newest first
                } catch (Exception e) {
                    return 0;
                }
            })
            .collect(Collectors.toList());

        // Apply pagination
        int startIndex = offset;
        int endIndex = Math.min(startIndex + limit, fragments.size());

        for (int i = startIndex; i < endIndex; i++) {
            orders.add(convertFragmentToMap(fragments.get(i)));
        }

        return orders;
    }

    private boolean passesDateFilter(ContentFragment cf, String startDate, String endDate) {
        if (startDate == null && endDate == null) {
            return true;
        }

        try {
            String createdDateStr = cf.getElement("createdAt").getContent();
            LocalDateTime orderDate = LocalDateTime.parse(createdDateStr);

            if (startDate != null && !startDate.isEmpty()) {
                LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
                if (orderDate.isBefore(start)) {
                    return false;
                }
            }

            if (endDate != null && !endDate.isEmpty()) {
                LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
                if (orderDate.isAfter(end)) {
                    return false;
                }
            }

            return true;
        } catch (Exception e) {
            LOG.warn("Error parsing date for filter", e);
            return true;
        }
    }

    private int getTotalOrderFragments(ResourceResolver resolver, String userId, 
                                      String startDate, String endDate) {
        
        String userOrdersPath = ORDERS_CF_PATH + "/" + userId;
        Resource userOrdersResource = resolver.getResource(userOrdersPath);
        if (userOrdersResource == null) {
            return 0;
        }

        return (int) StreamSupport.stream(userOrdersResource.getChildren().spliterator(), false)
            .map(resource -> resource.adaptTo(ContentFragment.class))
            .filter(Objects::nonNull)
            .filter(cf -> passesDateFilter(cf, startDate, endDate))
            .count();
    }

    private Map<String, Object> convertFragmentToMap(ContentFragment cf) {
        Map<String, Object> order = new HashMap<>();

        try {
            order.put("id", cf.getElement("orderId").getContent());
            order.put("orderNumber", cf.getElement("orderNumber").getContent());
            order.put("userId", cf.getElement("userId").getContent());
            order.put("totalAmount", Double.parseDouble(cf.getElement("totalAmount").getContent()));
            order.put("discountAmount", Double.parseDouble(cf.getElement("discountAmount").getContent()));
            order.put("finalAmount", Double.parseDouble(cf.getElement("finalAmount").getContent()));
            order.put("paymentMethod", cf.getElement("paymentMethod").getContent());
            order.put("status", cf.getElement("status").getContent());
            order.put("createdAt", cf.getElement("createdAt").getContent());
            order.put("updatedAt", cf.getElement("createdAt").getContent()); // CF não tem updatedAt nativo

            // Parse items JSON
            String itemsJson = cf.getElement("items").getContent();
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> items = mapper.readValue(itemsJson, List.class);
            order.put("items", items);

        } catch (Exception e) {
            LOG.error("Erro ao converter Content Fragment para Map", e);
        }

        return order;
    }

    private int parseInt(String value, int defaultValue) {
        if (value == null || value.trim().isEmpty()) {
            return defaultValue;
        }
        try {
            int parsed = Integer.parseInt(value);
            return Math.max(1, parsed);
        } catch (NumberFormatException e) {
            return defaultValue;
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
